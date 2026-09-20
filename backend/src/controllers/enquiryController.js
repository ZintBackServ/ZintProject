// ── NOTE: This controller handles both General Enquiry Registration and Curriculum Download Registration ──
const mongoose = require("mongoose");
const enquiryModel = require("../models/enquiryModel");
const courseModel  = require("../models/courseModel");
const { sendCurriculumEmail, sendEnquiryNotificationEmail } = require("../utils/sendEmail");
const { sendWhatsAppMessage } = require("../services/whatsappService");

// ── POST /addEnquiry ──────────────────────────────────────────────
const addEnquiry = async (req, res) => {
  try {
    const { fullName, email, mobile, course, mode, message } = req.body;

    if (!fullName?.trim() || !email?.trim() || !mobile?.trim())
      return res.status(400).json({ msg: "Full name, email and mobile are required" });

    if (!course || !mongoose.Types.ObjectId.isValid(course))
      return res.status(400).json({ msg: "Valid course is required" });

    if (!mode?.trim())
      return res.status(400).json({ msg: "Mode of training is required" });

    const courseExists = await courseModel.findById(course);
    if (!courseExists)
      return res.status(404).json({ msg: "Selected course not found" });

    const enquiry = await enquiryModel.create({
      fullName: fullName.trim(),
      email: email.trim(),
      mobile: mobile.trim(),
      course,
      mode: mode.trim(),
      message: message?.trim(),
    });

    // Notify admissions through the configured email and WhatsApp number.
    // Notification failures never prevent the enquiry from being saved.
    sendEnquiryNotificationEmail({
      fullName: enquiry.fullName,
      email: enquiry.email,
      mobile: enquiry.mobile,
      courseName: courseExists.courseName,
      mode: enquiry.mode,
      message: enquiry.message,
    }).catch((err) => console.error("Enquiry email notification failed:", err.message));

    const whatsAppRecipient = process.env.WATSAPPNUMBER?.trim();
    if (whatsAppRecipient) {
      const details = [
        "📩 *New Website Enquiry*",
        `Name: ${enquiry.fullName}`,
        `Email: ${enquiry.email}`,
        `Mobile: ${enquiry.mobile}`,
        `Course: ${courseExists.courseName}`,
        `Mode: ${enquiry.mode}`,
        `Message: ${enquiry.message || "—"}`,
      ].join("\n");
      sendWhatsAppMessage(whatsAppRecipient, details)
        .catch((err) => console.error("Enquiry WhatsApp notification failed:", err.message));
    }

    // Send curriculum PDF via Gmail if this is a curriculum download request
    if (mode.trim().toLowerCase() === "curriculum download") {
      sendCurriculumEmail(
        email.trim(),
        fullName.trim(),
        courseExists.courseName,
        courseExists.courseCurriculum
      ).catch((err) => console.error("Async curriculum email error:", err));
    }

    const populated = await enquiry.populate("course", "courseName");

    return res.status(201).json({ msg: "Enquiry submitted successfully", data: populated });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Internal Server Error", error: error.message });
  }
};

// ── GET /allEnquiries ──────────────────────────────────────────────
const getAllEnquiries = async (req, res) => {
  try {
    const enquiries = await enquiryModel
      .find()
      .populate("course", "courseName")
      .sort({ createdAt: -1 });

    return res.status(200).json({ msg: "Enquiries fetched successfully", data: enquiries });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

// ── GET /enquiryById/:id ───────────────────────────────────────────
const getEnquiryById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ msg: "Invalid Id" });

    const enquiry = await enquiryModel.findById(id).populate("course", "courseName");
    if (!enquiry)
      return res.status(404).json({ msg: "Enquiry not found" });

    return res.status(200).json({ msg: "Enquiry fetched successfully", data: enquiry });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

// ── PUT /markEnquiryContacted/:id ────────────────────────────────
const markEnquiryContacted = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ msg: "Invalid Id" });

    const enquiry = await enquiryModel.findByIdAndUpdate(id, { isContacted: true }, { new: true });
    if (!enquiry)
      return res.status(404).json({ msg: "Enquiry not found" });

    return res.status(200).json({ msg: "Marked as contacted", data: enquiry });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

// ── DELETE /deleteEnquiry/:id ────────────────────────────────────
const deleteEnquiry = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ msg: "Invalid Id" });

    const deleted = await enquiryModel.findByIdAndDelete(id);
    if (!deleted)
      return res.status(404).json({ msg: "Enquiry not found" });

    return res.status(200).json({ msg: "Enquiry deleted successfully", data: deleted });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

module.exports = {
  addEnquiry,
  getAllEnquiries,
  getEnquiryById,
  markEnquiryContacted,
  deleteEnquiry,
};
