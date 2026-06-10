const express = require("express");
const router  = express.Router();
const {
  registerForEvent,
  getRegistrationsByEvent,
  getAllRegistrations,
  deleteRegistration,
} = require("../controllers/registrationController");

// POST   /register                     → student registers for event
router.post("/add", registerForEvent);

// GET    /register/all                 → admin: all registrations
router.get("/all", getAllRegistrations);

// GET    /register/event/:eventId      → admin: registrations for one event
router.get("/event/:eventId", getRegistrationsByEvent);

// DELETE /register/:id                 → admin: remove a registration
router.delete("/:id", deleteRegistration);

module.exports = router;
