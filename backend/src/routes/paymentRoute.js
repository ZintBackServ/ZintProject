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

// ── Public ────────────────────────────────────────────────────
// Razorpay server-to-server webhook (raw body needed — mount BEFORE express.json())
router.post("/webhook", express.raw({ type: "application/json" }), razorpayWebhook);

// ── authenticationed ─────────────────────────────────────────────────
router.post("/create-order", authentication, createOrder);
router.post("/verify",       authentication, verifyPayment);
router.post("/enroll-free",  authentication, enrollFree);

// ── Admin ─────────────────────────────────────────────────────
router.post("/refund/:enrollmentId", authentication,  authorization("admin"), refundPayment);

module.exports = router;