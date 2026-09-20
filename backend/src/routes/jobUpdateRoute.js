const express = require("express");
const router = express.Router();
const upload = require("../middlewares/multerMiddleware");
const authentication = require("../middlewares/authMiddleware");
const authorization = require("../middlewares/authorization");
const { messagingLimiter } = require("../middlewares/rateLimiter");
const { getJobUpdates, createJobUpdate, registerJobInterest } = require("../controllers/jobUpdateController");

router.get("/", getJobUpdates);
router.post("/", authentication, authorization("admin"), upload.single("poster"), createJobUpdate);
router.post("/:jobUpdateId/connect", messagingLimiter, registerJobInterest);

module.exports = router;
