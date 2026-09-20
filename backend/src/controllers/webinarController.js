const mongoose = require("mongoose");
const Webinar = require("../models/webinarModel");
const WebinarRegistration = require("../models/webinarRegistrationModel");
const { uploadOnCloudinary } = require("../utils/cloudinary");
const { sendWhatsAppMessage } = require("../services/whatsappService");

const isText = (value) => typeof value === "string" && value.trim().length > 0;
const WEBSITE_URL = "https://zintinstitute.in";
const INSTAGRAM_URL = "https://www.instagram.com/zintinstitute/";

const confirmationMessage = (webinar, registration) => {
  const meetingLine = webinar.meetingLink
    ? `🔗 *Join link:* ${webinar.meetingLink}`
    : "🔗 *Join link:* Will be shared before the webinar.";

  return [
    "🎉 *Webinar registration confirmed!*",
    "",
    `Hello *${registration.fullName}*,`,
    `You are registered for *${webinar.title}*.`,
    "",
    `📅 *Date:* ${new Date(webinar.date).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}`,
    `🕒 *Time:* ${webinar.time}`,
    `👨‍🏫 *Mentor:* ${webinar.mentor}`,
    meetingLine,
    `🌐 *Website:* ${WEBSITE_URL}`,
    `📸 *Instagram:* ${INSTAGRAM_URL}`,
    "",
    "See you there!",
    "*Zint Institute*",
  ].join("\n");
};

const getWebinars = async (_req, res) => {
  try {
    const webinars = await Webinar.find().sort({ date: 1, createdAt: -1 }).lean();
    res.json({ success: true, webinars });
  } catch (error) {
    res.status(500).json({ success: false, message: "Unable to load webinars." });
  }
};

const createWebinar = async (req, res) => {
  try {
    const { title, description, mentor, mentorRole, date, time, meetingLink, category, isRegistrationOpen } = req.body;
    if (![title, description, mentor, date, time].every(isText)) {
      return res.status(400).json({ success: false, message: "Title, description, mentor, date, and time are required." });
    }
    if (!req.file) {
      return res.status(400).json({ success: false, message: "A webinar poster is required." });
    }

    const uploadedPoster = await uploadOnCloudinary(req.file.path, "image");
    if (!uploadedPoster?.url) {
      return res.status(500).json({ success: false, message: "Poster upload failed. Please try again." });
    }

    const webinar = await Webinar.create({
      title: title.trim(), description: description.trim(), mentor: mentor.trim(),
      mentorRole: mentorRole?.trim(), date, time: time.trim(), meetingLink: meetingLink?.trim(),
      category: category?.trim() || "webdev", poster: uploadedPoster.url,
      isRegistrationOpen: isRegistrationOpen !== "false",
    });
    res.status(201).json({ success: true, message: "Webinar added successfully.", webinar });
  } catch (error) {
    console.error("Create webinar error:", error.message);
    res.status(500).json({ success: false, message: "Unable to add webinar." });
  }
};

const updateWebinar = async (req, res) => {
  try {
    const { webinarId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(webinarId)) {
      return res.status(400).json({ success: false, message: "Invalid webinar." });
    }

    const { title, description, mentor, mentorRole, date, time, meetingLink, category, isRegistrationOpen } = req.body;
    if (![title, description, mentor, date, time].every(isText)) {
      return res.status(400).json({ success: false, message: "Title, description, mentor, date, and time are required." });
    }

    const webinar = await Webinar.findById(webinarId);
    if (!webinar) return res.status(404).json({ success: false, message: "Webinar not found." });

    if (req.file) {
      const uploadedPoster = await uploadOnCloudinary(req.file.path, "image");
      if (!uploadedPoster?.url) {
        return res.status(500).json({ success: false, message: "Poster upload failed. Please try again." });
      }
      webinar.poster = uploadedPoster.url;
    }

    webinar.title = title.trim();
    webinar.description = description.trim();
    webinar.mentor = mentor.trim();
    webinar.mentorRole = mentorRole?.trim() || "Industry Expert";
    webinar.date = date;
    webinar.time = time.trim();
    webinar.meetingLink = meetingLink?.trim() || "";
    webinar.category = category?.trim() || "webdev";
    webinar.isRegistrationOpen = isRegistrationOpen !== "false";
    await webinar.save();

    res.json({ success: true, message: "Webinar updated successfully.", webinar });
  } catch (error) {
    console.error("Update webinar error:", error.message);
    res.status(500).json({ success: false, message: "Unable to update webinar." });
  }
};

const deleteWebinar = async (req, res) => {
  try {
    const { webinarId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(webinarId)) {
      return res.status(400).json({ success: false, message: "Invalid webinar." });
    }

    const webinar = await Webinar.findByIdAndDelete(webinarId);
    if (!webinar) return res.status(404).json({ success: false, message: "Webinar not found." });
    await WebinarRegistration.deleteMany({ webinar: webinarId });

    res.json({ success: true, message: "Webinar removed successfully." });
  } catch (error) {
    console.error("Delete webinar error:", error.message);
    res.status(500).json({ success: false, message: "Unable to remove webinar." });
  }
};

const getWebinarRegistrationSummary = async (_req, res) => {
  try {
    const counts = await WebinarRegistration.aggregate([
      { $group: { _id: "$webinar", registrationCount: { $sum: 1 } } },
    ]);
    const registrationsByWebinar = Object.fromEntries(
      counts.map((item) => [String(item._id), item.registrationCount])
    );
    const totalRegistrations = counts.reduce((total, item) => total + item.registrationCount, 0);
    res.json({ success: true, totalRegistrations, registrationsByWebinar });
  } catch (error) {
    console.error("Webinar registration summary error:", error.message);
    res.status(500).json({ success: false, message: "Unable to load registration totals." });
  }
};

const getWebinarRegistrations = async (req, res) => {
  try {
    const { webinarId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(webinarId)) {
      return res.status(400).json({ success: false, message: "Invalid webinar." });
    }
    const webinar = await Webinar.findById(webinarId).select("title date time").lean();
    if (!webinar) return res.status(404).json({ success: false, message: "Webinar not found." });

    const registrations = await WebinarRegistration.find({ webinar: webinarId })
      .select("fullName email phone status interest whatsAppSent createdAt")
      .sort({ createdAt: -1 })
      .lean();
    res.json({ success: true, webinar, totalRegistrations: registrations.length, registrations });
  } catch (error) {
    console.error("Get webinar registrations error:", error.message);
    res.status(500).json({ success: false, message: "Unable to load webinar registrations." });
  }
};

const registerForWebinar = async (req, res) => {
  try {
    const { webinarId } = req.params;
    const { fullName, email, phone, status, interest } = req.body;
    if (!mongoose.Types.ObjectId.isValid(webinarId)) {
      return res.status(400).json({ success: false, message: "Invalid webinar." });
    }
    if (![fullName, email, phone].every(isText) || !/^\S+@\S+\.\S+$/.test(email.trim())) {
      return res.status(400).json({ success: false, message: "Name, valid email, and WhatsApp number are required." });
    }
    const webinar = await Webinar.findById(webinarId);
    if (!webinar || !webinar.isRegistrationOpen) {
      return res.status(404).json({ success: false, message: "This webinar is not open for registration." });
    }

    let registration = await WebinarRegistration.findOne({ webinar: webinarId, email: email.trim().toLowerCase() });
    const alreadyRegistered = Boolean(registration);
    if (!registration) {
      registration = await WebinarRegistration.create({
        webinar: webinarId, fullName: fullName.trim(), email: email.trim(), phone: phone.trim(), status, interest,
      });
    }

    let sendResult = { success: registration.whatsAppSent };
    if (!registration.whatsAppSent) {
      sendResult = await sendWhatsAppMessage(registration.phone, confirmationMessage(webinar, registration));
      if (sendResult.success) {
        registration.whatsAppSent = true;
        await registration.save();
      }
    }

    res.status(alreadyRegistered ? 200 : 201).json({
      success: true,
      alreadyRegistered,
      whatsAppSent: Boolean(sendResult.success),
      message: sendResult.success
        ? "Registration confirmed. Webinar details were sent to WhatsApp."
        : "Registration saved. WhatsApp is not connected yet, so the confirmation could not be sent.",
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(200).json({ success: true, alreadyRegistered: true, message: "You are already registered for this webinar." });
    }
    console.error("Webinar registration error:", error.message);
    res.status(500).json({ success: false, message: "Unable to register for this webinar." });
  }
};

module.exports = {
  getWebinars,
  createWebinar,
  updateWebinar,
  deleteWebinar,
  getWebinarRegistrationSummary,
  getWebinarRegistrations,
  registerForWebinar,
};
