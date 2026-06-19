const Enrollment = require("../models/enrollmentModel");

// ─────────────────────────────────────────────
// @desc    Create/enroll in a course
// @route   POST /api/enrollments
// @access  Private
// ─────────────────────────────────────────────
const createEnrollment = async (req, res) => {
  try {
    const { courseId } = req.body;

    if (!courseId) {
      return res.status(400).json({ success: false, message: "courseId is required." });
    }

    // Prevent duplicate enrollment
    const existing = await Enrollment.findOne({ userId: req.user._id, courseId });
    if (existing) {
      return res.status(400).json({ success: false, message: "Already enrolled in this course." });
    }

    const enrollment = await Enrollment.create({
      userId: req.user._id,
      courseId,
      status: "active",
      progress: 0,
    });

    res.status(201).json({ success: true, data: enrollment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─────────────────────────────────────────────
// @desc    Get all enrollments (admin) or own (user)
// @route   GET /api/enrollments
// @access  Private
// ─────────────────────────────────────────────
const getEnrollments = async (req, res) => {
  try {
    const filter = req.user.role === "admin" ? {} : { userId: req.user._id };
    // console.log("inside getEnrollments : ", req)
    if (req.query.status) filter.status = req.query.status;
    if (req.query.paymentStatus) filter.paymentStatus = req.query.paymentStatus;

    const enrollments = await Enrollment.find(filter)
       .populate("userId", "firstName email")
      .populate("courseId", "courseName courseImage fee")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: enrollments.length,
      data: enrollments,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─────────────────────────────────────────────
// @desc    Get a single enrollment by ID
// @route   GET /api/enrollments/:id
// @access  Private
// ─────────────────────────────────────────────
const getEnrollmentById = async (req, res) => {
  try {
    
    const enrollment = await Enrollment.findById(req.params.id)
      .populate("userId", "firstName email")
      .populate("courseId", "courseName courseImage fee");

    if (!enrollment) {
      return res.status(404).json({ success: false, message: "Enrollment not found." });
    }

    const isOwner = enrollment.userId._id.toString() === req.user._id.toString();
    if (!isOwner && req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Access denied." });
    }

    res.status(200).json({ success: true, data: enrollment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─────────────────────────────────────────────
// @desc    Update progress (0–100)
// @route   PATCH /api/enrollments/:id/progress
// @access  Private (own enrollment only)
// ─────────────────────────────────────────────
const updateProgress = async (req, res) => {
  try {
    const { progress } = req.body;

    if (typeof progress !== "number" || progress < 0 || progress > 100) {
      return res.status(400).json({
        success: false,
        message: "Progress must be a number between 0 and 100.",
      });
    }

    const enrollment = await Enrollment.findById(req.params.id);

    if (!enrollment) {
      return res.status(404).json({ success: false, message: "Enrollment not found." });
    }

    if (enrollment.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Access denied." });
    }

    if (enrollment.status !== "active") {
      return res.status(400).json({
        success: false,
        message: "Can only update progress on active enrollments.",
      });
    }

    enrollment.progress = progress;
    if (progress === 100) enrollment.status = "completed";

    const updated = await enrollment.save();

    res.status(200).json({
      success: true,
      message: updated.status === "completed" ? "Course completed! 🎉" : "Progress updated.",
      data: updated,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─────────────────────────────────────────────
// @desc    Update enrollment status (admin)
// @route   PATCH /api/enrollments/:id/status
// @access  Private (admin only)
// ─────────────────────────────────────────────
const updateEnrollmentStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const allowedStatuses = ["active", "completed", "expired", "cancelled", "pending"];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Status must be one of: ${allowedStatuses.join(", ")}.`,
      });
    }

    const enrollment = await Enrollment.findById(req.params.id);
    if (!enrollment) {
      return res.status(404).json({ success: false, message: "Enrollment not found." });
    }

    enrollment.status = status;
    const updated = await enrollment.save();

    res.status(200).json({
      success: true,
      message: `Enrollment status updated to "${status}".`,
      data: updated,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─────────────────────────────────────────────
// @desc    Cancel own enrollment
// @route   PATCH /api/enrollments/:id/cancel
// @access  Private (own enrollment only)
// ─────────────────────────────────────────────
const cancelEnrollment = async (req, res) => {
  try {
    const enrollment = await Enrollment.findById(req.params.id);

    if (!enrollment) {
      return res.status(404).json({ success: false, message: "Enrollment not found." });
    }

    if (enrollment.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Access denied." });
    }

    if (enrollment.status === "cancelled") {
      return res.status(400).json({ success: false, message: "Already cancelled." });
    }

    enrollment.status = "cancelled";
    const updated = await enrollment.save();

    res.status(200).json({ success: true, message: "Enrollment cancelled.", data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─────────────────────────────────────────────
// @desc    Delete enrollment (admin only)
// @route   DELETE /api/enrollments/:id
// @access  Private (admin only)
// ─────────────────────────────────────────────
const deleteEnrollment = async (req, res) => {
  try {
    const enrollment = await Enrollment.findById(req.params.id);
    if (!enrollment) {
      return res.status(404).json({ success: false, message: "Enrollment not found." });
    }

    await enrollment.deleteOne();
    res.status(200).json({ success: true, message: "Enrollment deleted." });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createEnrollment,
  getEnrollments,
  getEnrollmentById,
  updateProgress,
  updateEnrollmentStatus,
  cancelEnrollment,
  deleteEnrollment,
};