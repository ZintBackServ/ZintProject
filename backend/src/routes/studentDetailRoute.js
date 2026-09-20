const express = require("express");
const router = express.Router();
const authentication = require("../middlewares/authMiddleware");
const authorization = require("../middlewares/authorization");

const {
  getMyDetails,
  submitStudentDetails,
  getAllStudentDetailsAdmin,
  getStudentDetailByIdAdmin,
  updateStudentDetailAdmin,
  toggleAllFeeSubmittedAdmin,
  deleteStudentDetailAdmin,
  sendManualWhatsAppReminder,
} = require("../controllers/studentDetailController");

// ── Student Routes ──
router.get("/my-details", authentication, getMyDetails);
router.post("/submit", authentication, submitStudentDetails);

// ── Admin Routes ──
router.get("/admin/all", authentication, authorization("admin"), getAllStudentDetailsAdmin);
router.get("/admin/:id", authentication, authorization("admin"), getStudentDetailByIdAdmin);
router.put("/admin/:id", authentication, authorization("admin"), updateStudentDetailAdmin);
router.patch("/admin/:id/toggle-fee-status", authentication, authorization("admin"), toggleAllFeeSubmittedAdmin);
router.delete("/admin/:id", authentication, authorization("admin"), deleteStudentDetailAdmin);
router.post("/admin/:id/send-manual-reminder", authentication, authorization("admin"), sendManualWhatsAppReminder);

module.exports = router;
