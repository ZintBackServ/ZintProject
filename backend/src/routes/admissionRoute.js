const express = require("express");
const router  = express.Router();
const {
  applyAdmission,
  getAdmissions,
  getAdmissionById,
  updateAdmissionStatus,
  deleteAdmission,
} = require("../controllers/AdmissionController");

const authentication = require("../middlewares/authMiddleware");
const authorization  = require("../middlewares/authorization");
const rateLimit = require("express-rate-limit");
const publicAdmissionLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 8, standardHeaders: true, legacyHeaders: false, message: { success: false, msg: "Too many applications. Please try again later." } });

// Logged-in users
router.post("/apply",      publicAdmissionLimiter, applyAdmission);
router.get("/",            authentication, getAdmissions);
router.get("/:id",         authentication, getAdmissionById);

// Admin only
router.patch("/:id/status", authentication, authorization("admin"), updateAdmissionStatus);
router.delete("/:id",       authentication, authorization("admin"), deleteAdmission);

module.exports = router;
