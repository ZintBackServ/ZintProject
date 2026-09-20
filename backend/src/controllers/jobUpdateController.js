const mongoose = require("mongoose");
const JobUpdate = require("../models/jobUpdateModel");
const JobInterest = require("../models/jobInterestModel");
const { uploadOnCloudinary } = require("../utils/cloudinary");
const { sendWhatsAppMessage } = require("../services/whatsappService");

const isText = (value) => typeof value === "string" && value.trim().length > 0;

const getJobUpdates = async (_req, res) => {
  try {
    const jobUpdates = await JobUpdate.find().sort({ date: -1, createdAt: -1 }).lean();
    res.json({ success: true, jobUpdates });
  } catch (error) {
    res.status(500).json({ success: false, message: "Unable to load job updates." });
  }
};

const createJobUpdate = async (req, res) => {
  try {
    const { date, location } = req.body;
    if (!date || !isText(location)) {
      return res.status(400).json({ success: false, message: "Date and location are required." });
    }
    if (!req.file) {
      return res.status(400).json({ success: false, message: "A job poster is required." });
    }

    const uploadedPoster = await uploadOnCloudinary(req.file.path, "image");
    if (!uploadedPoster?.url) {
      return res.status(500).json({ success: false, message: "Poster upload failed. Please try again." });
    }

    const jobUpdate = await JobUpdate.create({ poster: uploadedPoster.url, date, location: location.trim() });
    res.status(201).json({ success: true, message: "Job update published successfully.", jobUpdate });
  } catch (error) {
    console.error("Create job update error:", error.message);
    res.status(500).json({ success: false, message: "Unable to publish job update." });
  }
};

const registerJobInterest = async (req, res) => {
  try {
    const { jobUpdateId } = req.params;
    const { name, phone } = req.body;
    if (!mongoose.Types.ObjectId.isValid(jobUpdateId)) {
      return res.status(400).json({ success: false, message: "Invalid job update." });
    }
    if (!isText(phone) || String(phone).replace(/\D/g, "").length < 10) {
      return res.status(400).json({ success: false, message: "Please enter a valid WhatsApp number." });
    }

    const jobUpdate = await JobUpdate.findById(jobUpdateId);
    if (!jobUpdate) return res.status(404).json({ success: false, message: "Job update not found." });

    const interest = await JobInterest.create({ jobUpdate: jobUpdateId, name: name?.trim() || "", phone: phone.trim() });
    const recipient = process.env.WATSAPPNUMBER?.trim();
    let notificationSent = false;
    if (recipient) {
      const message = [
        "💼 *New Job Update Enquiry*",
        `Name: ${interest.name || "Not provided"}`,
        `WhatsApp: ${interest.phone}`,
        `Job date: ${jobUpdate.date.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}`,
        `Location: ${jobUpdate.location}`,
      ].join("\n");
      const result = await sendWhatsAppMessage(recipient, message);
      notificationSent = Boolean(result.success);
      if (notificationSent) {
        interest.whatsAppSent = true;
        await interest.save();
      }
    }

    res.status(201).json({
      success: true,
      notificationSent,
      message: notificationSent
        ? "Your request has been sent to Zint Institute."
        : "Your request has been registered. The Zint team will contact you soon.",
    });
  } catch (error) {
    console.error("Job interest registration error:", error.message);
    res.status(500).json({ success: false, message: "Unable to register your request." });
  }
};

module.exports = { getJobUpdates, createJobUpdate, registerJobInterest };
