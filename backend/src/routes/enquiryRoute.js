// ── NOTE: These routes serve both General Enquiry Registration and Curriculum Download Registration (mode: "Curriculum Download") ──
const express = require("express");
const router  = express.Router();
const {
  addEnquiry,
  getAllEnquiries,
  getEnquiryById,
  markEnquiryContacted,
  deleteEnquiry,
} = require("../controllers/enquiryController");

const authentication = require("../middlewares/authMiddleware");
const authorization  = require("../middlewares/authorization");

const { formLimiter } = require("../middlewares/rateLimiter");

// Public — anyone can submit an enquiry (rate-limited)
router.post("/addEnquiry", formLimiter, addEnquiry);

// Admin only — view, manage, delete enquiries
router.get("/allEnquiries",               authentication, authorization("admin"), getAllEnquiries);
router.get("/enquiryById/:id",            authentication, authorization("admin"), getEnquiryById);
router.put("/markEnquiryContacted/:id",   authentication, authorization("admin"), markEnquiryContacted);
router.delete("/deleteEnquiry/:id",       authentication, authorization("admin"), deleteEnquiry);

module.exports = router;