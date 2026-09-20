const express = require("express");
const router = express.Router();
const authentication = require("../middlewares/authMiddleware");
const authorization = require("../middlewares/authorization");
const { sendWhatsAppMessage, getWhatsAppStatus } = require("../services/whatsappService");
const {
  registerForTraining,
  getMyRegistrations,
  getStatus,
} = require("../controllers/trainingRegistrationController");

router.post("/register", authentication, registerForTraining);
router.get("/myRegistrations", authentication, getMyRegistrations);
router.get("/status", getStatus);

// POST /trainingRegistration/test-message  { phone: "9876543210", message: "Hello!" }
router.post("/test-message", authentication, authorization("admin"), async (req, res) => {
  const { phone, message } = req.body;
  const waStatus = getWhatsAppStatus();
  if (!waStatus.isConnected) {
    return res.status(503).json({
      success: false,
      msg: "WhatsApp is NOT connected. Check terminal logs.",
      waStatus,
    });
  }
  const result = await sendWhatsAppMessage(phone, message || "🔔 Test message from Zint Institute server!");
  return res.json({ success: result.success, result, waStatus });
});

module.exports = router;

