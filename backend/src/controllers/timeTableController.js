const mongoose = require("mongoose");
const timeTableModel = require("../models/timeTableModel");

const { CATEGORIES } = timeTableModel;
const ALLOWED_FIELDS = ["category", "course", "faculty", "date", "time", "meetingLink"];

// ── POST /addTimetable ────────────────────────────────────────────
const addTimetable = async (req, res) => {
  try {
    const { category, course, faculty, date, time, meetingLink } = req.body;

    if (!category || !CATEGORIES.includes(category))
      return res.status(400).json({ msg: "Valid category is required" });

    if (!course?.trim() || !faculty?.trim() || !date?.trim() || !time?.trim() || !meetingLink?.trim())
      return res.status(400).json({ msg: "Course, faculty, date, time and meeting link are required" });

    const entry = await timeTableModel.create({
      category,
      course: course.trim(),
      faculty: faculty.trim(),
      date: date.trim(),
      time: time.trim(),
      meetingLink: meetingLink.trim(),
    });

    return res.status(201).json({ msg: "Timetable entry added successfully", data: entry });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Internal Server Error", error: error.message });
  }
};

// ── GET /allTimetable?category=Online Training ────────────────────
const getAllTimetable = async (req, res) => {
  try {
    const { category } = req.query;

    if (category && !CATEGORIES.includes(category))
      return res.status(400).json({ msg: "Valid category is required" });

    const filter = category ? { category } : {};

    const entries = await timeTableModel.find(filter).sort({ createdAt: -1 });
    return res.status(200).json({ msg: "Timetable fetched successfully", data: entries });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

// ── GET /timetableById/:id ─────────────────────────────────────────
const getTimetableById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ msg: "Invalid Id" });

    const entry = await timeTableModel.findById(id);
    if (!entry)
      return res.status(404).json({ msg: "Timetable entry not found" });

    return res.status(200).json({ msg: "Timetable entry fetched successfully", data: entry });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

// ── PUT /updateTimetable/:id ───────────────────────────────────────
const updateTimetable = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ msg: "Invalid Id" });

    if (req.body.category && !CATEGORIES.includes(req.body.category))
      return res.status(400).json({ msg: "Valid category is required" });

    // Whitelist + trim fields so callers can't inject arbitrary keys
    // (e.g. _id, createdAt) and empty strings don't slip past validation.
    const updates = {};
    for (const field of ALLOWED_FIELDS) {
      if (req.body[field] !== undefined) {
        updates[field] =
          typeof req.body[field] === "string" ? req.body[field].trim() : req.body[field];
      }
    }

    if (Object.keys(updates).length === 0)
      return res.status(400).json({ msg: "No valid fields provided to update" });

    const updated = await timeTableModel.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
      context: "query", // needed for some validators to work correctly on updates
    });

    if (!updated)
      return res.status(404).json({ msg: "Timetable entry not found" });

    return res.status(200).json({ msg: "Timetable entry updated successfully", data: updated });
  } catch (error) {
    console.log(error);
    if (error.name === "ValidationError")
      return res.status(400).json({ msg: "Validation failed", error: error.message });
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

// ── DELETE /deleteTimetable/:id ────────────────────────────────────
const deleteTimetable = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ msg: "Invalid Id" });

    const deleted = await timeTableModel.findByIdAndDelete(id);
    if (!deleted)
      return res.status(404).json({ msg: "Timetable entry not found" });

    return res.status(200).json({ msg: "Timetable entry deleted successfully", data: deleted });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

module.exports = {
  addTimetable,
  getAllTimetable,
  getTimetableById,
  updateTimetable,
  deleteTimetable,
};