const Razorpay = require("razorpay");
const crypto = require("crypto");
const Enrollment = require("../models/enrollmentModel");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// ─────────────────────────────────────────────
// @desc    Create a Razorpay order (step 1 of payment)
// @route   POST /api/payments/create-order
// @access  Private
// ─────────────────────────────────────────────
const createOrder = async (req, res) => {
  try {
    const { courseId, amount, currency = "INR" } = req.body;

    if (!courseId || !amount) {
      return res.status(400).json({
        success: false,
        message: "courseId and amount are required.",
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
      },
    });

     console.log( {
        userId:        req.user._id,
        courseId,
        orderId:       order.id,
        amount,
        currency,

        paymentStatus: "pending",
        status:        "pending",
      },)


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
    return res.status(500).json({
      success: false,
      message: error?.error?.description || error.message,
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
      expiredAt,
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

    if (expectedSignature !== razorpay_signature) {
      await Enrollment.findOneAndUpdate(
        { orderId: razorpay_order_id },
        { paymentStatus: "failed", status: "cancelled" }
      );
      return res.status(400).json({
        success: false,
        message: "Payment verification failed. Invalid signature.",
      });
    }

    // Activate enrollment
    const enrollment = await Enrollment.findOneAndUpdate(
      { orderId: razorpay_order_id },
      {
        paymentId:     razorpay_payment_id,
        signature:     razorpay_signature,
        paymentStatus: "paid",
        status:        "active",
        purchasedAt:   new Date(),
        expiredAt:     expiredAt || null,
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
    console.error("verifyPayment error:", error);
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
    const { courseId, expiredAt } = req.body;

    if (!courseId) {
      return res.status(400).json({
        success: false,
        message: "courseId is required.",
      });
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
      expiredAt:     expiredAt || null,
    });

    return res.status(201).json({
      success: true,
      message: "Enrolled successfully (free course).",
      data: enrollment,
    });
  } catch (error) {
    if (res.headersSent) return;
    console.error("enrollFree error:", error);
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

    const expectedSignature = crypto
      .createHmac("sha256", webhookSecret)
      .update(JSON.stringify(req.body))
      .digest("hex");

    if (receivedSignature !== expectedSignature) {
      return res.status(400).json({
        success: false,
        message: "Invalid webhook signature.",
      });
    }

    const event   = req.body.event;
    const payload = req.body.payload?.payment?.entity;

    if (event === "payment.captured" && payload) {
      await Enrollment.findOneAndUpdate(
        { orderId: payload.order_id },
        {
          paymentId:     payload.id,
          paymentStatus: "paid",
          status:        "active",
          purchasedAt:   new Date(),
        }
      );
    }

    if (event === "payment.failed" && payload) {
      await Enrollment.findOneAndUpdate(
        { orderId: payload.order_id },
        { paymentStatus: "failed", status: "cancelled" }
      );
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    if (res.headersSent) return;
    console.error("razorpayWebhook error:", error);
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
    console.error("refundPayment error:", error);
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
  razorpayWebhook,
  refundPayment,
};