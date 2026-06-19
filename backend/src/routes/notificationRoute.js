const express = require("express");
const router  = express.Router();

const {
  getNotifications,
  getAllNotificationsAdmin,
  createNotification,
  toggleNotification,
  updateNotification,
  deleteNotification,
} = require("../controllers/notificationController");

const authentication = require("../middlewares/authMiddleware");
const authorization  = require("../middlewares/authorization");
const upload         = require("../middlewares/multerMiddleware"); // same as mentorRoutes

// ── Public / User ──────────────────────────────────────────
router.get("/", getNotifications);

// ── Admin only ─────────────────────────────────────────────
router.get(
  "/all",
  authentication,
  authorization("admin"),
  getAllNotificationsAdmin
);

router.post(
  "/",
  authentication,
  authorization("admin"),
  upload.fields([{ name: "image", maxCount: 1 }]), // multer handles file, then controller uploads to Cloudinary
  createNotification
);

router.patch(
  "/:id/toggle",
  authentication,
  authorization("admin"),
  toggleNotification
);

router.put(
  "/:id",
  authentication,
  authorization("admin"),
  upload.fields([{ name: "image", maxCount: 1 }]), // optional — only if replacing image
  updateNotification
);

router.delete(
  "/:id",
  authentication,
  authorization("admin"),
  deleteNotification
);

module.exports = router;