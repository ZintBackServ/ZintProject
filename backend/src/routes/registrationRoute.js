const express = require("express");
const router  = express.Router();
const {
  registerForEvent,
  getRegistrationsByEvent,
  getAllRegistrations,
  deleteRegistration,
} = require("../controllers/registrationController");

// POST   /api/register                     → student registers for event
router.post("/", registerForEvent);

// GET    /api/register/all                 → admin: all registrations
router.get("/all", getAllRegistrations);

// GET    /api/register/event/:eventId      → admin: registrations for one event
router.get("/event/:eventId", getRegistrationsByEvent);

// DELETE /api/register/:id                 → admin: remove a registration
router.delete("/:id", deleteRegistration);

module.exports = router;
