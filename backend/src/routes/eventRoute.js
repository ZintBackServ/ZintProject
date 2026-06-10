const express = require("express");
const router = express.Router();
const {
    getAllEvent,
    addEvent,
    updateEvent,
    deleteEvent,
} = require("../controllers/eventController");

const upload = require("../middlewares/multerMiddleware")

router.post("/addEvent",upload.fields([
    {
        name:"eventImage",
        maxCount:1
    }
]),addEvent);

router.get("/allEvent", getAllEvent);
router.delete("/deleteEvent/:id", deleteEvent);
router.put("/updateEvent/:id",
    upload.fields([{ name: "eventImage", maxCount: 1 }]),
    updateEvent);

module.exports = router;