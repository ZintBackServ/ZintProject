const express = require("express");
const router  = express.Router();
const {
  addRating,
  getAllRatings,
  getRatingsByTarget,
  getRatingStats,
  toggleVisibility,
  deleteRating,
  deleteAllRatingsByTarget,
} = require("../controllers/ratingController");

// ── PUBLIC ROUTES ─────────────────────────────────────────────────────────────
router.post("/addRating", addRating);
router.get("/target/:targetName", getRatingsByTarget); // param name now matches controller

// ── ADMIN ROUTES ──────────────────────────────────────────────────────────────
router.get("/stats", getRatingStats);
router.get("/all", getAllRatings);
router.patch("/visibility/:id", toggleVisibility);
router.delete("/delete/:id", deleteRating);
router.delete("/target/:targetName", deleteAllRatingsByTarget);

module.exports = router;