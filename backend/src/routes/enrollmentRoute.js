const express = require("express");
const router = express.Router();
const {
  createEnrollment,
  getEnrollments,
  getEnrollmentById,
  updateProgress,
  updateEnrollmentStatus,
  cancelEnrollment,
  deleteEnrollment,
} = require("../controllers/enrollmentController");

// ✅ Single consistent import style
const authentication = require("../middlewares/authMiddleware");
const authorization  = require("../middlewares/authorization");

router.get("/",    authentication, getEnrollments);
router.post("/",   authentication, createEnrollment);

router.get("/:id", authentication, getEnrollmentById);

router.patch("/:id/progress", authentication, updateProgress);
router.patch("/:id/cancel",   authentication, cancelEnrollment);

// Admin-only
router.patch("/:id/status", authentication, authorization("admin"), updateEnrollmentStatus);
router.delete("/:id",       authentication, authorization("admin"), deleteEnrollment);

module.exports = router;