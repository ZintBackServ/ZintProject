const Notification = require("../models/notificationModel");
const Course       = require("../models/courseModel");
const { uploadOnCloudinary } = require("../utils/cloudinary"); // same as mentorController
const Event = require("../models/eventModel"); // uncomment when ready

// ─────────────────────────────────────────────────────────────
// HELPER — attach full course / event data to each notification
// ─────────────────────────────────────────────────────────────
const attachRefData = async (notifications) => {
  return await Promise.all(
    notifications.map(async (n) => {
      const obj = n.toObject();

      if (n.type === "course" && n.refId) {
        obj.refData = await Course.findById(n.refId).select(
          "courseName title thumbnail price category"
        );
      }

      if (n.type === "event" && n.refId) {
        obj.refData = await Event.findById(n.refId).select(
          "title description date location thumbnail"
        );
      }

      return obj;
    })
  );
};

// ─────────────────────────────────────────────
// @desc   Get all active notifications (navbar bell)
// @route  GET /api/notifications
// @access Public
// ─────────────────────────────────────────────
const getNotifications = async (req, res) => {
  try {
    const now = new Date();

    const notifications = await Notification.find({
      isActive: true,
      $or: [{ expiresAt: null }, { expiresAt: { $gt: now } }],
    }).sort({ createdAt: -1 });

    const data = await attachRefData(notifications);

    res.status(200).json({ success: true, count: data.length, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─────────────────────────────────────────────
// @desc   Get ALL notifications including inactive (admin)
// @route  GET /api/notifications/all
// @access Private (admin only)
// ─────────────────────────────────────────────
const getAllNotificationsAdmin = async (req, res) => {
  try {
    const notifications = await Notification.find().sort({ createdAt: -1 });
    const data = await attachRefData(notifications);

    res.status(200).json({ success: true, count: data.length, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─────────────────────────────────────────────
// @desc   Create a notification (admin)
// @route  POST /api/notifications
// @access Private (admin only)
// ─────────────────────────────────────────────
const createNotification = async (req, res) => {
  try {
    const { title, message, type, refId, isActive, expiresAt } = req.body;

    if (!title || !type) {
      return res.status(400).json({ success: false, message: "title and type are required." });
    }

    if ((type === "course" || type === "event") && !refId) {
      return res.status(400).json({
        success: false,
        message: `refId is required when type is "${type}".`,
      });
    }

    // ── Cloudinary upload (same pattern as mentorController) ──
    let imageUrl = null;
    if (req.files && req.files.image) {
      const imageLocalPath = req.files.image[0].path;
      const uploaded = await uploadOnCloudinary(imageLocalPath);

      if (!uploaded) {
        return res.status(400).json({ success: false, message: "Image upload to Cloudinary failed." });
      }

      imageUrl = uploaded.url;
    }

    const notification = await Notification.create({
      title,
      message:   message   || null,
      image:     imageUrl,
      type,
      refId:     refId     || null,
      isActive:  isActive  !== undefined ? isActive : true,
      expiresAt: expiresAt || null,
    });

    res.status(201).json({ success: true, data: notification });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─────────────────────────────────────────────
// @desc   Toggle isActive (show/hide) (admin)
// @route  PATCH /api/notifications/:id/toggle
// @access Private (admin only)
// ─────────────────────────────────────────────
const toggleNotification = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      return res.status(404).json({ success: false, message: "Notification not found." });
    }

    notification.isActive = !notification.isActive;
    await notification.save();

    res.status(200).json({
      success: true,
      message: `Notification is now ${notification.isActive ? "active" : "hidden"}.`,
      data: notification,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─────────────────────────────────────────────
// @desc   Update a notification (admin)
// @route  PUT /api/notifications/:id
// @access Private (admin only)
// ─────────────────────────────────────────────
const updateNotification = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      return res.status(404).json({ success: false, message: "Notification not found." });
    }

    // ── Replace image on Cloudinary if a new one is uploaded ──
    if (req.files && req.files.image) {
      const imageLocalPath = req.files.image[0].path;
      const uploaded = await uploadOnCloudinary(imageLocalPath);

      if (!uploaded) {
        return res.status(400).json({ success: false, message: "Image upload to Cloudinary failed." });
      }

      notification.image = uploaded.url;
    }

    // Update text fields
    const fields = ["title", "message", "type", "refId", "isActive", "expiresAt"];
    fields.forEach((f) => {
      if (req.body[f] !== undefined) notification[f] = req.body[f];
    });

    const updated = await notification.save();
    res.status(200).json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─────────────────────────────────────────────
// @desc   Delete a notification (admin)
// @route  DELETE /api/notifications/:id
// @access Private (admin only)
// ─────────────────────────────────────────────
const deleteNotification = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      return res.status(404).json({ success: false, message: "Notification not found." });
    }

    await notification.deleteOne();
    res.status(200).json({ success: true, message: "Notification deleted." });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getNotifications,
  getAllNotificationsAdmin,
  createNotification,
  toggleNotification,
  updateNotification,
  deleteNotification,
};