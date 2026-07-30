const express = require("express");
const router = express.Router();
const {
    addRegistration,
    getAllRegistrations,
    getRegistrationsByEvent,
    deleteRegistration,
} = require("../controllers/eventRegistrationController");

// ✅ Single consistent import style
const authentication = require("../middlewares/authMiddleware");
const authorization  = require("../middlewares/authorization");

// Any logged-in user can register for an event
router.post("/add", authentication, addRegistration);

// Admin-only — viewing and managing registrations
router.get("/all",       authentication, authorization("admin"), getAllRegistrations);
router.get("/event/:id", authentication, authorization("admin"), getRegistrationsByEvent);
router.delete("/:id",    authentication, authorization("admin"), deleteRegistration);

module.exports = router;