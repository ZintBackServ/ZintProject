const Admission   = require("../models/AdmissionModel");
const courseModel = require("../models/courseModel");
const mongoose    = require("mongoose");
const logger      = require("../utils/logger");

// ── POST /admission/apply ─────────────────────────────────────────────────────
// @desc   Submit an admission application
// @access Private (logged-in users)
const applyAdmission = async (req, res) => {
  try {
    const { courseId } = req.body;
    const userId = req.user._id;
    const name   = `${req.user.firstName} ${req.user.lastName || ""}`.trim();
    const email  = req.user.email;

    if (!courseId || !mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({ success: false, msg: "Valid courseId is required." });
    }

    const course = await courseModel.findById(courseId);
    if (!course) return res.status(404).json({ success: false, msg: "Course not found." });

    // Unique index on (userId, courseId) prevents duplicates
    const admission = await Admission.create({ userId, name, email, courseId });

    return res.status(201).json({
      success: true,
      msg: "Admission application submitted successfully.",
      data: admission,
    });
  } catch (error) {
    logger.error("applyAdmission error:", error);
    if (error.code === 11000) {
      return res.status(409).json({ success: false, msg: "You have already applied for this course." });
    }
    return res.status(500).json({ success: false, msg: "Internal Server Error" });
  }
};

// ── GET /admission/ ───────────────────────────────────────────────────────────
// @desc   Get all admissions (admin) or own (user), with pagination
// @access Private
const getAdmissions = async (req, res) => {
  try {
    const page  = Math.max(1, parseInt(req.query.page)  || 1);
    const limit = Math.min(100, parseInt(req.query.limit) || 20);
    const skip  = (page - 1) * limit;

    const filter = req.userRole === "admin" ? {} : { userId: req.user._id };
    if (req.query.status) filter.status = req.query.status;

    const [admissions, total] = await Promise.all([
      Admission.find(filter)
        .populate("userId",   "firstName lastName email")
        .populate("courseId", "courseName courseImage fee online_fee mode")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Admission.countDocuments(filter),
    ]);

    return res.status(200).json({
      success: true,
      data: admissions,
      pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    logger.error("getAdmissions error:", error);
    return res.status(500).json({ success: false, msg: "Internal Server Error" });
  }
};

// ── GET /admission/:id ────────────────────────────────────────────────────────
// @desc   Get a single admission
// @access Private (owner or admin)
const getAdmissionById = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, msg: "Invalid Id" });
    }
    const admission = await Admission.findById(req.params.id)
      .populate("userId",   "firstName lastName email")
      .populate("courseId", "courseName courseImage");

    if (!admission) return res.status(404).json({ success: false, msg: "Admission not found." });

    const isOwner = admission.userId._id.toString() === req.user._id.toString();
    if (!isOwner && req.userRole !== "admin") {
      return res.status(403).json({ success: false, msg: "Access denied." });
    }

    return res.status(200).json({ success: true, data: admission });
  } catch (error) {
    logger.error("getAdmissionById error:", error);
    return res.status(500).json({ success: false, msg: "Internal Server Error" });
  }
};

// ── PATCH /admission/:id/status ───────────────────────────────────────────────
// @desc   Update admission status (admin only)
// @access Private (admin)
const updateAdmissionStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const allowed = ["pending", "completed", "on hold"];
    if (!allowed.includes(status)) {
      return res.status(400).json({ success: false, msg: `Status must be one of: ${allowed.join(", ")}` });
    }
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, msg: "Invalid Id" });
    }

    const admission = await Admission.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );
    if (!admission) return res.status(404).json({ success: false, msg: "Admission not found." });

    return res.status(200).json({ success: true, msg: `Status updated to "${status}".`, data: admission });
  } catch (error) {
    logger.error("updateAdmissionStatus error:", error);
    return res.status(500).json({ success: false, msg: "Internal Server Error" });
  }
};

// ── DELETE /admission/:id ─────────────────────────────────────────────────────
// @desc   Delete an admission (admin only)
// @access Private (admin)
const deleteAdmission = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, msg: "Invalid Id" });
    }
    const admission = await Admission.findByIdAndDelete(req.params.id);
    if (!admission) return res.status(404).json({ success: false, msg: "Admission not found." });
    return res.status(200).json({ success: true, msg: "Admission deleted successfully." });
  } catch (error) {
    logger.error("deleteAdmission error:", error);
    return res.status(500).json({ success: false, msg: "Internal Server Error" });
  }
};

module.exports = {
  applyAdmission,
  getAdmissions,
  getAdmissionById,
  updateAdmissionStatus,
  deleteAdmission,
};
