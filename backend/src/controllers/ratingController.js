const Rating  = require("../models/ratingModel");
const User    = require("../models/userModel");
const mongoose = require("mongoose");

// ── POST /api/rating/addRating ──────────────────────────────────────────────
const addRating = async (req, res) => {
  try {
    // Requires authenticated user
    const userId = req.userId || req.user?._id;
    if (!userId) {
      return res.status(401).json({ msg: "Please sign in to submit a review" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(401).json({ msg: "User account not found" });
    }

    // Check if user is review-blocked by admin
    if (user.isReviewBlocked) {
      return res.status(403).json({ msg: "Your account has been blocked from submitting reviews." });
    }

    const { targetType, targetName, rating, review, studentName: customName, studentEmail: customEmail } = req.body;

    if (!targetType?.trim() || !targetName?.trim()) {
      return res.status(400).json({ msg: "targetType and targetName are required" });
    }
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ msg: "Rating must be between 1 and 5" });
    }

    let studentEmail = user.email.toLowerCase().trim();
    let studentName  = `${user.firstName || ""} ${user.lastName || ""}`.trim() || user.email.split("@")[0];

    // If logged in as admin, allow specifying custom student email and name
    if (user.role === "admin" && customEmail?.trim()) {
      studentEmail = customEmail.toLowerCase().trim();
      if (customName?.trim()) studentName = customName.trim();
    }

    // Check if user already reviewed this target item
    const existing = await Rating.findOne({
      targetName,
      studentEmail,
    });

    if (existing) {
      existing.rating = Number(rating);
      existing.review = review || "";
      existing.studentName = studentName;
      existing.isVisible = user.role === "admin" ? true : false; // Resubmit for admin approval if regular user
      await existing.save();

      return res.status(200).json({
        msg: user.role === "admin"
          ? "Existing review updated successfully!"
          : "Your review for this item has been updated and submitted for admin approval.",
        rating: existing,
      });
    }

    // New review: Enforce MAX 5 reviews per user limit across platform for regular users
    if (user.role !== "admin") {
      const userReviewsCount = await Rating.countDocuments({
        $or: [{ userId: user._id }, { studentEmail }]
      });
      if (userReviewsCount >= 5) {
        return res.status(400).json({ msg: "You have reached the maximum limit of 5 reviews across the platform." });
      }
    }

    const newRating = await Rating.create({
      targetType,
      targetName,
      userId: user._id,
      studentName,
      studentEmail,
      rating: Number(rating),
      review: review || "",
      isVisible: user.role === "admin" ? true : false, // Auto-approve if created directly by Admin
    });

    return res.status(201).json({
      msg: user.role === "admin"
        ? "Review added successfully!"
        : "Review submitted successfully! It will be published after admin approval.",
      rating: newRating,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ msg: "Your review for this item has already been submitted." });
    }
    console.error(error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

// ── GET /api/rating/all (Admin) ──────────────────────────────────────────────
const getAllRatings = async (req, res) => {
  try {
    const ratings = await Rating.find().populate("userId", "isReviewBlocked firstName lastName email").sort({ createdAt: -1 });

    // Build map of users block status by email if userId ref is missing
    const userEmails = [...new Set(ratings.map(r => r.studentEmail).filter(Boolean))];
    const users = await User.find({ email: { $in: userEmails } }, "email isReviewBlocked");
    const blockedMap = {};
    users.forEach(u => { blockedMap[u.email] = u.isReviewBlocked; });

    const enrichedRatings = ratings.map(r => {
      const doc = r.toObject();
      const isBlocked = doc.userId?.isReviewBlocked ?? blockedMap[doc.studentEmail] ?? false;
      return {
        ...doc,
        isUserBlocked: isBlocked,
      };
    });

    const summaryMap = {};
    ratings.forEach(r => {
      const key = `${r.targetType}:${r.targetName}`;
      if (!summaryMap[key]) {
        summaryMap[key] = {
          targetName: r.targetName,
          targetType: r.targetType,
          totalRatings: 0,
          totalScore: 0,
          avgRating: 0,
          distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
        };
      }
      summaryMap[key].totalRatings++;
      summaryMap[key].totalScore += r.rating;
      summaryMap[key].distribution[r.rating]++;
    });

    const summary = Object.values(summaryMap).map(s => ({
      ...s,
      avgRating: parseFloat((s.totalScore / s.totalRatings).toFixed(1)),
    }));

    return res.status(200).json({ msg: "All ratings fetched", total: ratings.length, summary, ratings: enrichedRatings });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

// ── GET /api/rating/target/:targetName ───────────────────────────────────────
const getRatingsByTarget = async (req, res) => {
  try {
    const { targetName } = req.params;
    const { targetType } = req.query; // optional, e.g. targetType=event

    const filter = { isVisible: true };
    if (targetName && targetName.toLowerCase() !== "all") {
      filter.targetName = targetName;
    }
    if (targetType) filter.targetType = targetType;

    const ratings = await Rating.find(filter).sort({ createdAt: -1 });

    const totalRatings = ratings.length;
    const avgRating = totalRatings
      ? parseFloat((ratings.reduce((sum, r) => sum + r.rating, 0) / totalRatings).toFixed(1))
      : 0;

    const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    ratings.forEach(r => distribution[r.rating]++);

    return res.status(200).json({ msg: "Ratings fetched", totalRatings, avgRating, distribution, ratings });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

// ── GET /api/rating/stats ────────────────────────────────────────────────────
const getRatingStats = async (req, res) => {
  try {
    const ratings = await Rating.find();
    const totalRatings = ratings.length;
    const avgRating = totalRatings
      ? parseFloat((ratings.reduce((sum, r) => sum + r.rating, 0) / totalRatings).toFixed(1))
      : 0;

    const byType = {};
    ratings.forEach(r => { byType[r.targetType] = (byType[r.targetType] || 0) + 1; });

    const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    ratings.forEach(r => distribution[r.rating]++);

    const recent = await Rating.find().sort({ createdAt: -1 }).limit(5);

    return res.status(200).json({ msg: "Stats fetched", totalRatings, avgRating, byType, distribution, recent });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

// ── PATCH /api/rating/visibility/:id ─────────────────────────────────────────
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

    return res.status(200).json({ msg: `Rating ${rating.isVisible ? "approved & published" : "hidden"} successfully`, rating });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

// ── PATCH /api/rating/block-user/:userId ──────────────────────────────────────
const toggleUserBlock = async (req, res) => {
  try {
    const { userId } = req.params;
    let user = null;

    if (mongoose.Types.ObjectId.isValid(userId)) {
      user = await User.findById(userId);
    }
    if (!user && req.body?.email) {
      user = await User.findOne({ email: req.body.email.toLowerCase().trim() });
    }

    if (!user) {
      return res.status(404).json({ msg: "User account not found" });
    }

    user.isReviewBlocked = !user.isReviewBlocked;
    await user.save();

    return res.status(200).json({
      msg: `User ${user.email} is now ${user.isReviewBlocked ? "blocked" : "unblocked"} from reviewing`,
      isReviewBlocked: user.isReviewBlocked,
      userId: user._id,
      email: user.email,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

// ── DELETE /api/rating/delete/:id ────────────────────────────────────────────
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

// ── DELETE /api/rating/target/:targetName ────────────────────────────────────
const deleteAllRatingsByTarget = async (req, res) => {
  try {
    const { targetName } = req.params;
    const { targetType } = req.query;

    const filter = { targetName };
    if (targetType) filter.targetType = targetType;

    const result = await Rating.deleteMany(filter);

    return res.status(200).json({ msg: `${result.deletedCount} ratings deleted`, deletedCount: result.deletedCount });
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
  toggleUserBlock,
  deleteRating,
  deleteAllRatingsByTarget,
};