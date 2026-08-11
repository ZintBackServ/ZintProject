const express = require("express");
const router  = express.Router();
const {
  addRating,
  getAllRatings,
  getRatingsByTarget,
  getRatingStats,
  toggleVisibility,
  toggleUserBlock,
  deleteRating,
  deleteAllRatingsByTarget,
} = require("../controllers/ratingController");

const authentication = require("../middlewares/authMiddleware");
const authorization  = require("../middlewares/authorization");

const { formLimiter } = require("../middlewares/rateLimiter");

// ── AUTHENTICATED USER ROUTES ──────────────────────────────────────────────────
router.post("/addRating", authentication, formLimiter, addRating);

// ── PUBLIC ROUTES ─────────────────────────────────────────────────────────────
router.get("/target/:targetName", getRatingsByTarget);

// ── ADMIN ROUTES ──────────────────────────────────────────────────────────────
router.get("/stats",                  authentication, authorization("admin"), getRatingStats);
router.get("/all",                    authentication, authorization("admin"), getAllRatings);
router.patch("/visibility/:id",       authentication, authorization("admin"), toggleVisibility);
router.patch("/block-user/:userId",   authentication, authorization("admin"), toggleUserBlock);
router.delete("/delete/:id",          authentication, authorization("admin"), deleteRating);
router.delete("/target/:targetName",  authentication, authorization("admin"), deleteAllRatingsByTarget);

module.exports = router;