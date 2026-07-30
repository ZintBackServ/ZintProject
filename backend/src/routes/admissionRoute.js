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

// Logged-in users
router.post("/apply",      authentication, applyAdmission);
router.get("/",            authentication, getAdmissions);
router.get("/:id",         authentication, getAdmissionById);

// Admin only
router.patch("/:id/status", authentication, authorization("admin"), updateAdmissionStatus);
router.delete("/:id",       authentication, authorization("admin"), deleteAdmission);

module.exports = router;
