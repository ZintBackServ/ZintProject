const Registration = require("../models/registrationModel");
const mongoose = require("mongoose");

// POST /api/register
const registerForEvent = async (req, res) => {
  try {
    const { eventId, eventName, name, email, phone, rollNo } = req.body;

    if (!eventId || !name?.trim() || !email?.trim()) {
      return res.status(400).json({ msg: "eventId, name and email are required" });
    }

    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      return res.status(400).json({ msg: "Invalid eventId" });
    }

    // prevent duplicate registration (same student same event)
    const existing = await Registration.findOne({ eventId, email: email.toLowerCase().trim() });
    if (existing) {
      return res.status(400).json({ msg: "You are already registered for this event" });
    }

    const registration = await Registration.create({
      eventId,
      eventName,
      name,
      email,
      phone:  phone  || "",
      rollNo: rollNo || "",
    });

    return res.status(201).json({
      msg: "Registered successfully",
      registration,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

// GET /api/register/event/:eventId  — all students for one event
const getRegistrationsByEvent = async (req, res) => {
  try {
    const { eventId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      return res.status(400).json({ msg: "Invalid eventId" });
    }

    const registrations = await Registration.find({ eventId }).sort({ createdAt: -1 });

    return res.status(200).json({
      msg: "Registrations fetched",
      total: registrations.length,
      registrations,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

// GET /api/register/all  — every registration (admin overview)
const getAllRegistrations = async (req, res) => {
  try {
    const registrations = await Registration.find().sort({ createdAt: -1 });

    // group by event for summary
    const summary = {};
    registrations.forEach(r => {
      const key = String(r.eventId);
      if (!summary[key]) summary[key] = { eventId: key, eventName: r.eventName, count: 0 };
      summary[key].count++;
    });

    return res.status(200).json({
      msg: "All registrations fetched",
      total: registrations.length,
      summary: Object.values(summary),
      registrations,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

// DELETE /api/register/:id  — remove a registration
const deleteRegistration = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ msg: "Invalid id" });
    }
    const deleted = await Registration.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ msg: "Registration not found" });
    return res.status(200).json({ msg: "Registration deleted" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

module.exports = { registerForEvent, getRegistrationsByEvent, getAllRegistrations, deleteRegistration };
