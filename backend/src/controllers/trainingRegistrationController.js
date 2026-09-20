const mongoose = require("mongoose");
const TrainingRegistration = require("../models/trainingRegistrationModel");
const Timetable = require("../models/timeTableModel");
const User = require("../models/userModel");
const { sendWhatsAppMessage, getWhatsAppStatus } = require("../services/whatsappService");

function buildConfirmationMessage(reg) {
  const joinLine = reg.meetingLink
    ? `🔗 *Meeting link:* ${reg.meetingLink}`
    : "🔗 *Meeting link:* Will be shared before class";

  return (
    `✅ *Successfully registered!* ✅\n\n` +
    `Hello *${reg.studentName}*,\n` +
    `You have successfully registered for *"${reg.course}"*.\n\n` +
    `Your meeting is scheduled on *${reg.date}* at *${reg.time}*.\n\n` +
    `👨‍🏫 *Faculty:* ${reg.faculty || "Faculty"}\n` +
    `${joinLine}\n` +
    `🌐 *Website:* https://zintinstitute.in\n` +
    `📸 *Instagram:* https://www.instagram.com/zintinstitute/\n\n` +
    `⏰ You will also receive a WhatsApp reminder *30 minutes before* the meeting starts — join then.\n\n` +
    `Best wishes,\n` +
    `*Zint Institute*`
  );
}

// ── POST /trainingRegistration/register ────────────────────────────
const registerForTraining = async (req, res) => {
  try {
    const userId = req.userId;
    const { timetableId, phoneNumber: bodyPhone } = req.body;

    if (!timetableId || !mongoose.Types.ObjectId.isValid(timetableId)) {
      return res.status(400).json({ success: false, msg: "Valid timetable ID is required." });
    }

    const timetable = await Timetable.findById(timetableId);
    if (!timetable) {
      return res.status(404).json({ success: false, msg: "Training session not found." });
    }

    // Check if already registered
    const existing = await TrainingRegistration.findOne({ userId, timetableId });
    if (existing) {
      // If registration exists but confirmation was never sent (WA was offline), resend now
      if (!existing.confirmationSent) {
        console.log(`[WA] Re-attempting confirmation message to ${existing.phoneNumber} for "${existing.course}"`);
        const resendResult = await sendWhatsAppMessage(
          existing.phoneNumber,
          buildConfirmationMessage(existing)
        );
        if (resendResult.success) {
          existing.confirmationSent = true;
          await existing.save();
        }
        return res.status(200).json({
          success: true,
          alreadyRegistered: true,
          msg: resendResult.success
            ? `You were already registered. Confirmation message has now been sent to ${existing.phoneNumber}! ✅`
            : `You are already registered. WhatsApp message could not be sent — please check server connection.`,
          data: existing,
          whatsAppSent: resendResult.success,
        });
      }

      return res.status(200).json({
        success: true,
        alreadyRegistered: true,
        msg: "You are already registered for this session.",
        data: existing,
      });
    }


    // Resolve user details & phone
    const user = await User.findById(userId);
    const studentName = `${user.firstName || ""} ${user.lastName || ""}`.trim() || "Student";
    const phoneNumber = (bodyPhone || user.contactNo || "").trim();

    if (!phoneNumber) {
      return res.status(400).json({
        success: false,
        requiresPhone: true,
        msg: "WhatsApp phone number is required to register and receive schedule details.",
      });
    }

    // If user provided a phone number and didn't have one saved in profile, save it
    if (!user.contactNo && phoneNumber) {
      user.contactNo = phoneNumber;
      await user.save().catch(() => {});
    }

    // Create registration record
    const registration = await TrainingRegistration.create({
      userId,
      timetableId,
      course: timetable.course,
      faculty: timetable.faculty,
      date: timetable.date,
      time: timetable.time,
      meetingLink: timetable.meetingLink,
      studentName,
      phoneNumber,
      studentEmail: user.email,
    });

    const sendResult = await sendWhatsAppMessage(phoneNumber, buildConfirmationMessage(registration));
    if (sendResult.success) {
      registration.confirmationSent = true;
      await registration.save();
    }

    return res.status(201).json({
      success: true,
      msg: sendResult.success
        ? `Registered successfully! Confirmation sent to WhatsApp (${phoneNumber}).`
        : `Registered successfully, but WhatsApp is not connected yet. Tap Register again after the server links WhatsApp to resend confirmation.`,
      data: registration,
      whatsAppSent: sendResult.success,
    });
  } catch (error) {
    console.error("Error in registerForTraining:", error);
    if (error.code === 11000) {
      return res.status(400).json({ success: false, msg: "You are already registered for this session." });
    }
    return res.status(500).json({ success: false, msg: "Internal Server Error", error: error.message });
  }
};

// ── GET /trainingRegistration/myRegistrations ──────────────────────
const getMyRegistrations = async (req, res) => {
  try {
    const userId = req.userId;
    const registrations = await TrainingRegistration.find({ userId }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: registrations,
    });
  } catch (error) {
    console.error("Error in getMyRegistrations:", error);
    return res.status(500).json({ success: false, msg: "Internal Server Error" });
  }
};

// ── GET /trainingRegistration/status ──────────────────────────────
const getStatus = async (req, res) => {
  return res.status(200).json({
    success: true,
    whatsApp: getWhatsAppStatus(),
  });
};

module.exports = {
  registerForTraining,
  getMyRegistrations,
  getStatus,
};
