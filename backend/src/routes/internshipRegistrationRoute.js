const express = require("express");
const router  = express.Router();
const {
  addInternshipRegistration,
  getAllInternshipRegistrations,
  getInternshipRegistrationById,
  markInternshipContacted,
  deleteInternshipRegistration,
} = require("../controllers/internshipRegistrationController");

const optionalAuth   = require("../middlewares/optionalAuth");
const authentication = require("../middlewares/authMiddleware");
const authorization  = require("../middlewares/authorization");

// ── Public — works for both guests and logged-in users ──
router.post("/addInternshipRegistration", optionalAuth, addInternshipRegistration);

// ── Admin only ──
router.get("/allInternshipRegistrations", authentication, authorization("admin"), getAllInternshipRegistrations);
router.get("/internshipRegistrationById/:id", authentication, authorization("admin"), getInternshipRegistrationById);
router.put("/markInternshipContacted/:id", authentication, authorization("admin"), markInternshipContacted);
router.delete("/deleteInternshipRegistration/:id", authentication, authorization("admin"), deleteInternshipRegistration);

module.exports = router;