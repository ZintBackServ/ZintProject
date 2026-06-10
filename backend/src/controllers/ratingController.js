const Rating  = require("../models/ratingModel");
const mongoose = require("mongoose");

// ── POST /api/rating  ─────────────────────────────────────────────────────────
// Student submits a rating
const addRating = async (req, res) => {
  try {
    const {  targetType, targetName, studentName, studentEmail, rating, review } = req.body;

    // validation
   
    if (!studentName?.trim() || !studentEmail?.trim()) {
      return res.status(400).json({ msg: "studentName and studentEmail are required" });
    }
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ msg: "Rating must be between 1 and 5" });
    }
  

    // check duplicate
    const existing = await Rating.findOne({
      studentEmail: studentEmail.toLowerCase().trim(),
    });
    if (existing) {
      return res.status(400).json({ msg: "You have already rated this" });
    }

    const newRating = await Rating.create({
      targetType,
      targetName,
      studentName,
      studentEmail,
      rating:  Number(rating),
      review:  review  || "",
    });

    return res.status(201).json({
      msg: "Rating submitted successfully",
      rating: newRating,
    });

  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ msg: "You have already rated this" });
    }
    console.error(error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

// ── GET /api/rating/all  ──────────────────────────────────────────────────────
// Admin: get all ratings with summary stats
const getAllRatings = async (req, res) => {
  try {
    const ratings = await Rating.find().sort({ createdAt: -1 });

    // summary grouped by target
    const summaryMap = {};
    ratings.forEach(r => {
      const key = String(r.targetId);
      if (!summaryMap[key]) {
        summaryMap[key] = {
          targetId:   key,
          targetName: r.targetName,
          targetType: r.targetType,
          totalRatings: 0,
          totalScore:   0,
          avgRating:    0,
          distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
        };
      }
      summaryMap[key].totalRatings++;
      summaryMap[key].totalScore += r.rating;
      summaryMap[key].distribution[r.rating]++;
    });

    // calculate averages
    const summary = Object.values(summaryMap).map(s => ({
      ...s,
      avgRating: parseFloat((s.totalScore / s.totalRatings).toFixed(1)),
    }));

    return res.status(200).json({
      msg: "All ratings fetched",
      total: ratings.length,
      summary,
      ratings,
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

// ── GET /api/rating/target/:targetId  ─────────────────────────────────────────
// Get all ratings for a specific event / course / mentor
const getRatingsByTarget = async (req, res) => {
  try {
    const { targetId } = req.params;

    const ratings = await Rating.find({ isVisible: true }).sort({ createdAt: -1 });

    const totalRatings = ratings.length;
    const avgRating    = totalRatings
      ? parseFloat((ratings.reduce((sum, r) => sum + r.rating, 0) / totalRatings).toFixed(1))
      : 0;

    const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    ratings.forEach(r => distribution[r.rating]++);

    return res.status(200).json({
      msg: "Ratings fetched",
      totalRatings,
      avgRating,
      distribution,
      ratings,
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

// ── GET /api/rating/stats  ────────────────────────────────────────────────────
// Admin: overall platform stats
const getRatingStats = async (req, res) => {
  try {
    const ratings = await Rating.find();

    const totalRatings = ratings.length;
    const avgRating    = totalRatings
      ? parseFloat((ratings.reduce((sum, r) => sum + r.rating, 0) / totalRatings).toFixed(1))
      : 0;

    // count by type
    const byType = {};
    ratings.forEach(r => {
      byType[r.targetType] = (byType[r.targetType] || 0) + 1;
    });

    // star distribution
    const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    ratings.forEach(r => distribution[r.rating]++);

    // recent 5
    const recent = await Rating.find().sort({ createdAt: -1 }).limit(5);

    return res.status(200).json({
      msg: "Stats fetched",
      totalRatings,
      avgRating,
      byType,
      distribution,
      recent,
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

// ── PATCH /api/rating/visibility/:id  ─────────────────────────────────────────
// Admin: show or hide a review
const toggleVisibility = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ msg: "Invalid id" });
    }

    const rating = await Rating.findById(id);
    if (!rating) return res.status(404).json({ msg: "Rating not found" });

    rating.isVisible = !rating.isVisible;
    await rating.save();

    return res.status(200).json({
      msg: `Rating ${rating.isVisible ? "shown" : "hidden"} successfully`,
      rating,
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

// ── DELETE /api/rating/:id  ───────────────────────────────────────────────────
// Admin: permanently delete a rating
const deleteRating = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ msg: "Invalid id" });
    }

    const deleted = await Rating.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ msg: "Rating not found" });

    return res.status(200).json({ msg: "Rating deleted successfully" });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

// ── DELETE /api/rating/target/:targetId  ──────────────────────────────────────
// Admin: delete ALL ratings for one event/course
const deleteAllRatingsByTarget = async (req, res) => {
  try {
    const { targetId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(targetId)) {
      return res.status(400).json({ msg: "Invalid targetId" });
    }

    const result = await Rating.deleteMany({ targetId });

    return res.status(200).json({
      msg: `${result.deletedCount} ratings deleted`,
      deletedCount: result.deletedCount,
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

module.exports = {
  addRating,
  getAllRatings,
  getRatingsByTarget,
  getRatingStats,
  toggleVisibility,
  deleteRating,
  deleteAllRatingsByTarget,
};
