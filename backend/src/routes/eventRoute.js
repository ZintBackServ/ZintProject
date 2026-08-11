const express = require("express");
const router = express.Router();
const {
    getAllEvent,
    addEvent,
    updateEvent,
    deleteEvent,
    getEventByName,
} = require("../controllers/eventController");

const upload = require("../middlewares/multerMiddleware");
const authentication = require("../middlewares/authMiddleware");
const authorization  = require("../middlewares/authorization");

// Public: anyone can view events
router.get("/allEvent", getAllEvent);
router.get("/name/:name", getEventByName);

// Admin only: add, update, delete
router.post("/addEvent",
    authentication, authorization("admin"),
    upload.fields([{ name: "eventImage", maxCount: 1 }]),
    addEvent
);
router.put("/updateEvent/:id",
    authentication, authorization("admin"),
    upload.fields([{ name: "eventImage", maxCount: 1 }]),
    updateEvent
);
router.delete("/deleteEvent/:id", authentication, authorization("admin"), deleteEvent);

module.exports = router;