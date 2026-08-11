const express = require("express");
const router  = express.Router();
const {
  addTimetable,
  getAllTimetable,
  getTimetableById,
  updateTimetable,
  deleteTimetable,
} = require("../controllers/timeTableController");

const authentication = require("../middlewares/authMiddleware");
const authorization  = require("../middlewares/authorization");

// ── Read — any logged-in user ──
router.get("/allTimetable", authentication, getAllTimetable); // ?category=Online Training
router.get("/timetableById/:id", authentication, getTimetableById);

// ── Admin only ──
router.post("/addTimetable", authentication, authorization("admin"), addTimetable);
router.put("/updateTimetable/:id", authentication, authorization("admin"), updateTimetable);
router.delete("/deleteTimetable/:id", authentication, authorization("admin"), deleteTimetable);

module.exports = router;