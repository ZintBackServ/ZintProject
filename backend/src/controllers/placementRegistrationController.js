const mongoose = require("mongoose");
const placementRegistrationModel = require("../models/placementRegistrationModel");

// ── POST /addPlacementRegistration ───────────────────────────────────
const addPlacementRegistration = async (req, res) => {
  try {
    const { course, message } = req.body;
    const isLoggedIn = !!req.user;

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

    if (!course?.trim())
      return res.status(400).json({ msg: "Course is required" });

    const registration = await placementRegistrationModel.create({
      user: isLoggedIn ? req.user._id : null,
      fullName: fullName.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      course: course.trim(),
      message: message?.trim(),
    });

    return res.status(201).json({ msg: "Placement registration submitted successfully", data: registration });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Internal Server Error", error: error.message });
  }
};

// ── GET /allPlacementRegistrations ────────────────────────────────────
const getAllPlacementRegistrations = async (req, res) => {
  try {
    const registrations = await placementRegistrationModel
      .find()
      .populate("user", "firstName lastName email")
      .sort({ createdAt: -1 });

    return res.status(200).json({ msg: "Registrations fetched successfully", data: registrations });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

// ── GET /placementRegistrationById/:id ─────────────────────────────────
const getPlacementRegistrationById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ msg: "Invalid Id" });

    const registration = await placementRegistrationModel
      .findById(id)
      .populate("user", "firstName lastName email");

    if (!registration)
      return res.status(404).json({ msg: "Registration not found" });

    return res.status(200).json({ msg: "Registration fetched successfully", data: registration });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

// ── PUT /markPlacementContacted/:id ───────────────────────────────────
const markPlacementContacted = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ msg: "Invalid Id" });

    const registration = await placementRegistrationModel.findByIdAndUpdate(
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

// ── DELETE /deletePlacementRegistration/:id ───────────────────────────
const deletePlacementRegistration = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ msg: "Invalid Id" });

    const deleted = await placementRegistrationModel.findByIdAndDelete(id);
    if (!deleted)
      return res.status(404).json({ msg: "Registration not found" });

    return res.status(200).json({ msg: "Registration deleted successfully", data: deleted });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

module.exports = {
  addPlacementRegistration,
  getAllPlacementRegistrations,
  getPlacementRegistrationById,
  markPlacementContacted,
  deletePlacementRegistration,
};