const express = require("express");
const router  = express.Router();
const {
  addPlacementRegistration,
  getAllPlacementRegistrations,
  getPlacementRegistrationById,
  markPlacementContacted,
  deletePlacementRegistration,
} = require("../controllers/placementRegistrationController");

const optionalAuth   = require("../middlewares/optionalAuth");
const authentication = require("../middlewares/authMiddleware");
const authorization  = require("../middlewares/authorization");

const { formLimiter } = require("../middlewares/rateLimiter");

// ── Public — works for both guests and logged-in users (rate-limited) ──
router.post("/addPlacementRegistration", formLimiter, optionalAuth, addPlacementRegistration);

// ── Admin only ──
router.get("/allPlacementRegistrations", authentication, authorization("admin"), getAllPlacementRegistrations);
router.get("/placementRegistrationById/:id", authentication, authorization("admin"), getPlacementRegistrationById);
router.put("/markPlacementContacted/:id", authentication, authorization("admin"), markPlacementContacted);
router.delete("/deletePlacementRegistration/:id", authentication, authorization("admin"), deletePlacementRegistration);

module.exports = router;