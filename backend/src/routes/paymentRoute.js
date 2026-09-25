const express = require("express");
const router = express.Router();
const {
  createOrder,
  verifyPayment,
  enrollFree,
  razorpayWebhook,
  refundPayment,
} = require("../controllers/paymentController");

const authentication = require("../middlewares/authMiddleware");
const authorization = require("../middlewares/authorization");
const rateLimit = require("express-rate-limit");
const { sendGuestCheckoutOtp, verifyGuestCheckoutOtp, createGuestOrder, enrollGuestFree, verifyGuestPayment } = require("../controllers/paymentController");

const checkoutOtpLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 5, standardHeaders: true, legacyHeaders: false, message: { success: false, message: "Too many code requests. Try again later." } });
const checkoutActionLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 20, standardHeaders: true, legacyHeaders: false });

// ── Public ────────────────────────────────────────────────────
// Razorpay server-to-server webhook (raw body needed — mount BEFORE express.json())
router.post("/webhook", express.raw({ type: "application/json" }), razorpayWebhook);

// Guest checkout requires email verification before an order can be created.
router.post("/guest/send-otp", checkoutOtpLimiter, sendGuestCheckoutOtp);
router.post("/guest/verify-otp", checkoutActionLimiter, verifyGuestCheckoutOtp);
router.post("/guest/create-order", checkoutActionLimiter, createGuestOrder);
router.post("/guest/enroll-free", checkoutActionLimiter, enrollGuestFree);
router.post("/guest/verify-payment", checkoutActionLimiter, verifyGuestPayment);

// ── authenticationed ─────────────────────────────────────────────────
router.post("/create-order", authentication, createOrder);
router.post("/verify",       authentication, verifyPayment);
router.post("/enroll-free",  authentication, enrollFree);

// ── Admin ─────────────────────────────────────────────────────
router.post("/refund/:enrollmentId", authentication,  authorization("admin"), refundPayment);

module.exports = router;
