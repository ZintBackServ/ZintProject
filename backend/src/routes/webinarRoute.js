const express = require("express");
const router = express.Router();
const upload = require("../middlewares/multerMiddleware");
const authentication = require("../middlewares/authMiddleware");
const authorization = require("../middlewares/authorization");
const { messagingLimiter } = require("../middlewares/rateLimiter");
const {
  getWebinars, createWebinar, updateWebinar, deleteWebinar,
  getWebinarRegistrationSummary, getWebinarRegistrations, registerForWebinar,
} = require("../controllers/webinarController");

router.get("/", getWebinars);
router.post("/", authentication, authorization("admin"), upload.single("poster"), createWebinar);
router.get("/admin/registration-summary", authentication, authorization("admin"), getWebinarRegistrationSummary);
router.get("/admin/:webinarId/registrations", authentication, authorization("admin"), getWebinarRegistrations);
router.put("/:webinarId", authentication, authorization("admin"), upload.single("poster"), updateWebinar);
router.delete("/:webinarId", authentication, authorization("admin"), deleteWebinar);
router.post("/:webinarId/register", messagingLimiter, registerForWebinar);

module.exports = router;
