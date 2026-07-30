const mongoose = require("mongoose");
const internshipRegistrationModel = require("../models/internshipRegistrationModel");
const categoryModel = require("../models/categoryModel");
const courseModel   = require("../models/courseModel");

// ── POST /addInternshipRegistration ─────────────────────────────────
const addInternshipRegistration = async (req, res) => {
  try {
    const { degree, category, course, duration } = req.body;
    const isLoggedIn = !!req.user;

    // ── Determine identity fields ──
    // Logged-in users: ALWAYS use their account data, ignore whatever
    // the client sent for these fields (prevents tampering via devtools).
    // Guests: identity fields must come from the request body.
    let fullName, email, phone;

    if (isLoggedIn) {
      fullName = `${req.user.firstName} ${req.user.lastName || ""}`.trim();
      email = req.user.email;
      phone = req.user.contactNo;

      if (!phone) {
        return res.status(400).json({
          msg: "Your account doesn't have a phone number on file. Please update your profile before registering.",
        });
      }
    } else {
      fullName = req.body.fullName;
      email = req.body.email;
      phone = req.body.phone;

      if (!fullName?.trim() || !email?.trim() || !phone?.trim())
        return res.status(400).json({ msg: "Full name, email and phone are required" });
    }

    if (!category || !mongoose.Types.ObjectId.isValid(category))
      return res.status(400).json({ msg: "Valid category is required" });

    if (!course || !mongoose.Types.ObjectId.isValid(course))
      return res.status(400).json({ msg: "Valid course is required" });

    if (!duration?.trim())
      return res.status(400).json({ msg: "Duration is required" });

    const categoryExists = await categoryModel.findById(category);
    if (!categoryExists)
      return res.status(404).json({ msg: "Category not found" });

    const courseExists = await courseModel.findById(course);
    if (!courseExists)
      return res.status(404).json({ msg: "Course not found" });

    const registration = await internshipRegistrationModel.create({
      user: isLoggedIn ? req.user._id : null,
      fullName: fullName.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      degree: degree?.trim(),
      category,
      course,
      duration: duration.trim(),
    });

    const populated = await registration.populate([
      { path: "category", select: "categoryName" },
      { path: "course", select: "courseName" },
    ]);

    return res.status(201).json({ msg: "Internship registration submitted successfully", data: populated });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Internal Server Error", error: error.message });
  }
};

// ── GET /allInternshipRegistrations ──────────────────────────────────
const getAllInternshipRegistrations = async (req, res) => {
  try {
    const registrations = await internshipRegistrationModel
      .find()
      .populate("category", "categoryName")
      .populate("course", "courseName")
      .populate("user", "firstName lastName email")
      .sort({ createdAt: -1 });

    return res.status(200).json({ msg: "Registrations fetched successfully", data: registrations });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

// ── GET /internshipRegistrationById/:id ──────────────────────────────
const getInternshipRegistrationById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ msg: "Invalid Id" });

    const registration = await internshipRegistrationModel
      .findById(id)
      .populate("category", "categoryName")
      .populate("course", "courseName")
      .populate("user", "firstName lastName email");

    if (!registration)
      return res.status(404).json({ msg: "Registration not found" });

    return res.status(200).json({ msg: "Registration fetched successfully", data: registration });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

// ── PUT /markInternshipContacted/:id ─────────────────────────────────
const markInternshipContacted = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ msg: "Invalid Id" });

    const registration = await internshipRegistrationModel.findByIdAndUpdate(
      id,
      { isContacted: true },
      { new: true }
    );

    if (!registration)
      return res.status(404).json({ msg: "Registration not found" });

    return res.status(200).json({ msg: "Marked as contacted", data: registration });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

// ── DELETE /deleteInternshipRegistration/:id ─────────────────────────
const deleteInternshipRegistration = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ msg: "Invalid Id" });

    const deleted = await internshipRegistrationModel.findByIdAndDelete(id);
    if (!deleted)
      return res.status(404).json({ msg: "Registration not found" });

    return res.status(200).json({ msg: "Registration deleted successfully", data: deleted });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

module.exports = {
  addInternshipRegistration,
  getAllInternshipRegistrations,
  getInternshipRegistrationById,
  markInternshipContacted,
  deleteInternshipRegistration,
};