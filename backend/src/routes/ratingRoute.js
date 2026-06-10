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

// POST   /api/rating              → student submits a rating
router.post("/addRating", addRating);

// GET    /api/rating/target/:targetId  → get ratings for one event/course/mentor
router.get("/target/:Id", getRatingsByTarget);

// ── ADMIN ROUTES ──────────────────────────────────────────────────────────────

// GET    /api/rating/stats        → overall platform rating stats
router.get("/stats", getRatingStats);

// GET    /api/rating/all          → all ratings with grouped summary
router.get("/all", getAllRatings);

// PATCH  /api/rating/visibility/:id   → toggle show/hide a review
router.patch("/visibility/:id", toggleVisibility);

// DELETE /api/rating/:id          → delete one rating
router.delete("/delete/:id", deleteRating);

// DELETE /api/rating/target/:targetId → delete all ratings for one target
router.delete("/target/:Id", deleteAllRatingsByTarget);

module.exports = router;
