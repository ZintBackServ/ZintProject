const Razorpay    = require("razorpay");
const crypto      = require("crypto");
const Enrollment  = require("../models/enrollmentModel");
const courseModel = require("../models/courseModel");
const logger      = require("../utils/logger");
const GuestEnrollment = require("../models/guestEnrollmentModel");
const CheckoutOtp = require("../models/checkoutOtpModel");
const jwt = require("jsonwebtoken");
const { sendOTPEmail } = require("../utils/sendEmail");

const razorpay = new Razorpay({
  key_id:     process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const checkoutTokenFromRequest = (req) => {
  const token = req.body?.verificationToken;
  if (!token) throw new Error("Email verification is required.");
  const payload = jwt.verify(token, process.env.JWT_SECRET_KEY);
  if (payload.purpose !== "guest-course-checkout") throw new Error("Invalid checkout verification.");
  return payload;
};

const sendGuestCheckoutOtp = async (req, res) => {
  try {
    const { fullName, email, mobile } = req.body || {};
    const cleanEmail = typeof email === "string" ? email.trim().toLowerCase() : "";
    const cleanName = typeof fullName === "string" ? fullName.trim() : "";
    const cleanMobile = typeof mobile === "string" ? mobile.replace(/\D/g, "") : "";
    if (cleanName.length < 2 || cleanName.length > 100 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail) || !/^\d{10}$/.test(cleanMobile)) {
      return res.status(400).json({ success: false, message: "Enter a valid full name, email, and 10-digit mobile number." });
    }
    const otp = crypto.randomInt(100000, 1000000).toString();
    const otpHash = crypto.createHmac("sha256", process.env.JWT_SECRET_KEY).update(`${cleanEmail}:${otp}`).digest("hex");
    await CheckoutOtp.deleteMany({ email: cleanEmail });
    await CheckoutOtp.create({ email: cleanEmail, fullName: cleanName, mobile: cleanMobile, otpHash, expiresAt: new Date(Date.now() + 10 * 60 * 1000) });
    await sendOTPEmail(cleanEmail, otp);
    return res.status(200).json({ success: true, message: "Verification code sent to your email." });
  } catch (error) {
    logger.error("sendGuestCheckoutOtp error:", error);
    return res.status(500).json({ success: false, message: "Could not send verification code. Please try again." });
  }
};

const verifyGuestCheckoutOtp = async (req, res) => {
  try {
    const email = typeof req.body?.email === "string" ? req.body.email.trim().toLowerCase() : "";
    const otp = typeof req.body?.otp === "string" ? req.body.otp.trim() : "";
    if (!email || !/^\d{6}$/.test(otp)) return res.status(400).json({ success: false, message: "Enter your email and the 6-digit code." });
    const record = await CheckoutOtp.findOne({ email, expiresAt: { $gt: new Date() } }).sort({ createdAt: -1 }).select("+otpHash");
    if (!record) return res.status(400).json({ success: false, message: "Code expired. Request a new one." });
    if (record.attempts >= 5) return res.status(429).json({ success: false, message: "Too many incorrect attempts. Request a new code." });
    const attemptedHash = crypto.createHmac("sha256", process.env.JWT_SECRET_KEY).update(`${email}:${otp}`).digest("hex");
    const isMatch = crypto.timingSafeEqual(Buffer.from(attemptedHash, "hex"), Buffer.from(record.otpHash, "hex"));
    if (!isMatch) {
      record.attempts += 1;
      await record.save();
      return res.status(400).json({ success: false, message: `Incorrect code. ${5 - record.attempts} attempt(s) remaining.` });
    }
    await CheckoutOtp.deleteMany({ email });
    const verificationToken = jwt.sign({ purpose: "guest-course-checkout", email, fullName: record.fullName, mobile: record.mobile }, process.env.JWT_SECRET_KEY, { expiresIn: "30m" });
    return res.status(200).json({ success: true, message: "Email verified.", verificationToken });
  } catch (error) {
    logger.error("verifyGuestCheckoutOtp error:", error);
    return res.status(400).json({ success: false, message: "Could not verify the code. Please request another." });
  }
};

const createGuestOrder = async (req, res) => {
  try {
    let identity;
    try { identity = checkoutTokenFromRequest(req); }
    catch { return res.status(401).json({ success: false, message: "Verify your email before continuing." }); }
    const { courseId, mode } = req.body || {};
    if (!courseId || !["Online", "Offline"].includes(mode)) return res.status(400).json({ success: false, message: "Choose a valid course mode." });
    const course = await courseModel.findById(courseId);
    if (!course) return res.status(404).json({ success: false, message: "Course not found." });
    if (course.mode !== "Hybrid" && course.mode !== mode) return res.status(400).json({ success: false, message: `This course is offered in ${course.mode} mode.` });
    const amount = Number(mode === "Online" ? (course.online_fee ?? course.fee) : (course.fee ?? course.online_fee));
    if (!Number.isFinite(amount) || amount <= 0) return res.status(400).json({ success: false, message: "This course does not have a payable fee for the selected mode." });
    const receipt = `g_${Date.now().toString(36)}_${crypto.randomBytes(5).toString("hex")}`;
    const order = await razorpay.orders.create({ amount: Math.round(amount * 100), currency: "INR", receipt, notes: { courseId: course._id.toString(), mode, email: identity.email } });
    await GuestEnrollment.create({ fullName: identity.fullName, email: identity.email, mobile: identity.mobile, courseId: course._id, courseName: course.courseName, mode, amount, orderId: order.id, paymentStatus: "pending", status: "pending" });
    return res.status(200).json({ success: true, order: { id: order.id, amount: order.amount, currency: order.currency }, key: process.env.RAZORPAY_KEY_ID });
  } catch (error) {
    logger.error("createGuestOrder error:", error);
    return res.status(400).json({ success: false, message: error?.error?.description || "Could not create payment order." });
  }
};

const enrollGuestFree = async (req, res) => {
  try {
    let identity;
    try { identity = checkoutTokenFromRequest(req); }
    catch { return res.status(401).json({ success: false, message: "Verify your email before continuing." }); }
    const { courseId, mode } = req.body || {};
    if (!courseId || !["Online", "Offline"].includes(mode)) return res.status(400).json({ success: false, message: "Choose a valid course mode." });
    const course = await courseModel.findById(courseId);
    if (!course) return res.status(404).json({ success: false, message: "Course not found." });
    if (course.mode !== "Hybrid" && course.mode !== mode) return res.status(400).json({ success: false, message: `This course is offered in ${course.mode} mode.` });
    const amount = Number(mode === "Online" ? (course.online_fee ?? course.fee ?? 0) : (course.fee ?? course.online_fee ?? 0));
    if (amount !== 0) return res.status(400).json({ success: false, message: "This course is not free in the selected mode." });
    const enrollment = await GuestEnrollment.create({ fullName: identity.fullName, email: identity.email, mobile: identity.mobile, courseId: course._id, courseName: course.courseName, mode, amount: 0, paymentStatus: "free", status: "active", purchasedAt: new Date() });
    return res.status(201).json({ success: true, message: "Enrollment confirmed.", data: { courseName: enrollment.courseName } });
  } catch (error) {
    logger.error("enrollGuestFree error:", error);
    return res.status(500).json({ success: false, message: "Could not complete enrollment." });
  }
};

const verifyGuestPayment = async (req, res) => {
  try {
    const { razorpay_order_id: orderId, razorpay_payment_id: paymentId, razorpay_signature: signature } = req.body || {};
    if (!orderId || !paymentId || typeof signature !== "string") return res.status(400).json({ success: false, message: "Missing payment verification fields." });
    const expected = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET).update(`${orderId}|${paymentId}`).digest("hex");
    if (signature.length !== expected.length || !crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) return res.status(400).json({ success: false, message: "Payment verification failed." });
    const enrollment = await GuestEnrollment.findOneAndUpdate({ orderId, paymentStatus: "pending" }, { paymentId, signature, paymentStatus: "paid", status: "active", purchasedAt: new Date() }, { new: true });
    if (!enrollment) {
      const alreadyPaid = await GuestEnrollment.findOne({ orderId, paymentId, paymentStatus: "paid" });
      if (alreadyPaid) return res.status(200).json({ success: true, message: "Payment already verified." });
      return res.status(404).json({ success: false, message: "Enrollment order not found." });
    }
    return res.status(200).json({ success: true, message: "Payment verified. Your enrollment is confirmed.", data: { courseName: enrollment.courseName, fullName: enrollment.fullName } });
  } catch (error) {
    logger.error("verifyGuestPayment error:", error);
    return res.status(500).json({ success: false, message: "Could not verify payment." });
  }
};

// ─────────────────────────────────────────────
// @desc    Create a Razorpay order (step 1 of payment)
// @route   POST /api/payments/create-order
// @access  Private
// ─────────────────────────────────────────────
const createOrder = async (req, res) => {
  try {
    // FIX: accept mode from client, but fetch actual price from DB
    const { courseId, mode = "offline", currency = "INR" } = req.body;

    if (!courseId) {
      return res.status(400).json({
        success: false,
        message: "courseId is required.",
      });
    }

    // Fetch course from DB — never trust client-sent amount
    const course = await courseModel.findById(courseId);
    if (!course) {
      return res.status(404).json({ success: false, message: "Course not found." });
    }

    // Determine price based on mode selected by user (case-insensitive check with fallback)
    const normalizedMode = (mode || "").toString().toLowerCase();
    const amount = normalizedMode === "online"
      ? (course.online_fee ?? course.fee)
      : (course.fee ?? course.online_fee);

    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: "This course has no fee set for the selected mode.",
      });
    }

    // Check for duplicate enrollment
    const existing = await Enrollment.findOne({
      userId: req.user._id,
      courseId,
      status: { $in: ["active", "completed"] },
    });
    if (existing) {
      return res.status(409).json({
        success: false,
        message: "You are already enrolled in this course.",
      });
    }

    // Amount in paise (Razorpay requires smallest currency unit)
    const amountInPaise = Math.round(amount * 100);

    // Receipt must be ≤ 40 characters
    const shortUserId   = req.user._id.toString().slice(-8);
    const shortCourseId = courseId.toString().slice(-8);
    const shortTs       = Date.now().toString().slice(-6);
    const receipt       = `r_${shortUserId}_${shortCourseId}_${shortTs}`;

    const order = await razorpay.orders.create({
      amount: amountInPaise,
      currency,
      receipt,
      notes: {
        userId:   req.user._id.toString(),
        courseId: courseId.toString(),
        mode,
      },
    });

    logger.info("Razorpay order created:", { userId: req.user._id, courseId, orderId: order.id, amount, mode });


    // Create a pending enrollment linked to this order
    await Enrollment.findOneAndUpdate(
      { userId: req.user._id, courseId },
      {
        userId:        req.user._id,
        courseId,
        orderId:       order.id,
        amount,
        currency,
        paymentStatus: "pending",
        status:        "pending",
      },
      { upsert: true, returnDocument: "after" }
    );

    return res.status(200).json({
      success: true,
      order: {
        id:       order.id,
        amount:   order.amount,
        currency: order.currency,
      },
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    if (res.headersSent) return;
    console.error("createOrder error:", error);
    logger.error("createOrder error:", error);
    const errMsg = error?.error?.description || error?.message || "Failed to process payment order.";
    const statusCode = error?.statusCode || error?.status || 400;
    return res.status(statusCode).json({
      success: false,
      message: errMsg,
    });
  }
};

// ─────────────────────────────────────────────
// @desc    Verify Razorpay payment & activate enrollment (step 2)
// @route   POST /api/payments/verify
// @access  Private
// ─────────────────────────────────────────────
const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Missing payment verification fields.",
      });
    }

    // Signature verification
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    const signatureIsValid =
      typeof razorpay_signature === "string" &&
      razorpay_signature.length === expectedSignature.length &&
      crypto.timingSafeEqual(Buffer.from(expectedSignature), Buffer.from(razorpay_signature));

    if (!signatureIsValid) {
      await Enrollment.findOneAndUpdate(
        { orderId: razorpay_order_id, userId: req.user._id },
        { paymentStatus: "failed", status: "cancelled" }
      );
      return res.status(400).json({
        success: false,
        message: "Payment verification failed. Invalid signature.",
      });
    }

    // Activate enrollment
    const enrollment = await Enrollment.findOneAndUpdate(
      { orderId: razorpay_order_id, userId: req.user._id, paymentStatus: "pending" },
      {
        paymentId:     razorpay_payment_id,
        signature:     razorpay_signature,
        paymentStatus: "paid",
        status:        "active",
        purchasedAt:   new Date(),
      },
      { returnDocument: "after" }
    )
      .populate("userId", "name email")
      .populate("courseId", "title");

    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: "Enrollment record not found for this order.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Payment verified. You are now enrolled! 🎉",
      data: enrollment,
    });
  } catch (error) {
    if (res.headersSent) return;
    logger.error("verifyPayment error:", error);
    return res.status(500).json({
      success: false,
      message: error?.error?.description || error.message,
    });
  }
};

// ─────────────────────────────────────────────
// @desc    Handle free course enrollment (no payment)
// @route   POST /api/payments/enroll-free
// @access  Private
// ─────────────────────────────────────────────
const enrollFree = async (req, res) => {
  try {
    const { courseId } = req.body;

    if (!courseId) {
      return res.status(400).json({
        success: false,
        message: "courseId is required.",
      });
    }

    const course = await courseModel.findById(courseId);
    if (!course) {
      return res.status(404).json({ success: false, message: "Course not found." });
    }

    const definedPrices = [course.fee, course.online_fee].filter(Number.isFinite);
    const isFreeCourse = definedPrices.length > 0 && definedPrices.every((price) => price === 0);
    if (!isFreeCourse) {
      return res.status(400).json({ success: false, message: "This course requires payment." });
    }

    const existing = await Enrollment.findOne({
      userId: req.user._id,
      courseId,
      status: { $in: ["active", "completed"] },
    });

    if (existing) {
      return res.status(409).json({
        success: false,
        message: "You are already enrolled in this course.",
      });
    }

    const enrollment = await Enrollment.create({
      userId:        req.user._id,
      courseId,
      paymentStatus: "free",
      status:        "active",
      amount:        0,
      purchasedAt:   new Date(),
    });

    return res.status(201).json({
      success: true,
      message: "Enrolled successfully (free course).",
      data: enrollment,
    });
  } catch (error) {
    if (res.headersSent) return;
    logger.error("enrollFree error:", error);
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "You are already enrolled in this course.",
      });
    }
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ─────────────────────────────────────────────
// @desc    Razorpay webhook (server-to-server confirmation)
// @route   POST /api/payments/webhook
// @access  Public (validated by webhook signature)
// ─────────────────────────────────────────────
const razorpayWebhook = async (req, res) => {
  try {
    const webhookSecret      = process.env.RAZORPAY_WEBHOOK_SECRET;
    const receivedSignature  = req.headers["x-razorpay-signature"];

    if (!webhookSecret || !receivedSignature || !Buffer.isBuffer(req.body)) {
      return res.status(400).json({ success: false, message: "Invalid webhook request." });
    }

    const expectedSignature = crypto
      .createHmac("sha256", webhookSecret)
      .update(req.body)
      .digest("hex");

    if (
      receivedSignature.length !== expectedSignature.length ||
      !crypto.timingSafeEqual(Buffer.from(receivedSignature), Buffer.from(expectedSignature))
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid webhook signature.",
      });
    }

    const webhook = JSON.parse(req.body.toString("utf8"));
    const event   = webhook.event;
    const payload = webhook.payload?.payment?.entity;

    if (event === "payment.captured" && payload) {
      const paidUpdate = {
          paymentId:     payload.id,
          paymentStatus: "paid",
          status:        "active",
          purchasedAt:   new Date(),
      };
      await Promise.all([
        Enrollment.findOneAndUpdate({ orderId: payload.order_id }, paidUpdate),
        GuestEnrollment.findOneAndUpdate({ orderId: payload.order_id }, paidUpdate),
      ]);
    }

    if (event === "payment.failed" && payload) {
      await Promise.all([
        Enrollment.findOneAndUpdate({ orderId: payload.order_id }, { paymentStatus: "failed", status: "cancelled" }),
        GuestEnrollment.findOneAndUpdate({ orderId: payload.order_id }, { paymentStatus: "failed", status: "cancelled" }),
      ]);
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    if (res.headersSent) return;
    logger.error("razorpayWebhook error:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ─────────────────────────────────────────────
// @desc    Initiate refund for an enrollment
// @route   POST /api/payments/refund/:enrollmentId
// @access  Private (admin only)
// ─────────────────────────────────────────────
const refundPayment = async (req, res) => {
  try {
    const enrollment = await Enrollment.findById(req.params.enrollmentId);

    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: "Enrollment not found.",
      });
    }

    if (!enrollment.paymentId) {
      return res.status(400).json({
        success: false,
        message: "No payment found for this enrollment.",
      });
    }

    if (enrollment.paymentStatus === "refunded") {
      return res.status(400).json({
        success: false,
        message: "Already refunded.",
      });
    }

    const { amount, reason } = req.body; // amount in INR; omit for full refund

    const refund = await razorpay.payments.refund(enrollment.paymentId, {
      ...(amount ? { amount: Math.round(amount * 100) } : {}),
      notes: { reason: reason || "Admin initiated refund" },
    });

    await Enrollment.findByIdAndUpdate(enrollment._id, {
      paymentStatus: "refunded",
      status:        "cancelled",
    });

    return res.status(200).json({
      success: true,
      message: "Refund initiated successfully.",
      refund,
    });
  } catch (error) {
    if (res.headersSent) return;
    logger.error("refundPayment error:", error);
    return res.status(500).json({
      success: false,
      message: error?.error?.description || error.message,
    });
  }
};

module.exports = {
  createOrder,
  verifyPayment,
  enrollFree,
  sendGuestCheckoutOtp,
  verifyGuestCheckoutOtp,
  createGuestOrder,
  enrollGuestFree,
  verifyGuestPayment,
  razorpayWebhook,
  refundPayment,
};
