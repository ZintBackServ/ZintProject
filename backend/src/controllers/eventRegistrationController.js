const eventRegistrationModel = require("../models/eventRegistrationModel");
const eventModel = require("../models/eventModel");
const mongoose = require("mongoose");

const {
    isValid,
} = require("../utils/validator");

// simple email format check
const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const addRegistration = async (req, res) => {
    try {
        const { event, name, email, phone, highestQualification } = req.body;

        // event validation
        if (!event || !mongoose.Types.ObjectId.isValid(event)) {
            return res.status(400).json({ msg: "Valid Event Id is required" });
        }

        const eventExists = await eventModel.findById(event);
        if (!eventExists) {
            return res.status(404).json({ msg: "Event not found" });
        }

        //name validation
        if (!isValid(name)) {
            return res.status(400).json({ msg: "Name is Missing Or Invalid" });
        }
        //email validation
        if (!isValid(email) || !isValidEmail(email.trim())) {
            return res.status(400).json({ msg: "Email is Missing Or Invalid" });
        }

        // phone is optional, but validate format if provided
        if (phone && !/^[0-9+\-\s]{7,15}$/.test(phone.trim())) {
            return res.status(400).json({ msg: "Phone number is invalid" });
        }

        // prevent duplicate registration for the same event with same email
        const alreadyRegistered = await eventRegistrationModel.findOne({
            event,
            email: email.trim().toLowerCase(),
        });
        if (alreadyRegistered) {
            return res.status(409).json({ msg: "This email is already registered for this event" });
        }

        const registration = await eventRegistrationModel.create({
            event,
            name: name.trim(),
            email: email.trim().toLowerCase(),
            phone: phone ? phone.trim() : undefined,
            highestQualification: highestQualification ? highestQualification.trim() : undefined,
        });

        const createdRegistration = await eventRegistrationModel
            .findById(registration._id)
            .populate("event", "name date time place");

        return res.status(201).json({ msg: "Registration successful", createdRegistration });

    } catch (error) {
        // duplicate key error from the unique (event, email) index — a safety net
        // in case two requests race past the earlier findOne check at the same time
        if (error.code === 11000) {
            return res.status(409).json({ msg: "This email is already registered for this event" });
        }
        console.log(error);
        return res.status(500).json({ msg: "Internal Server Error" });
    }
};

const getAllRegistrations = async (req, res) => {
    try {
        const registrations = await eventRegistrationModel
            .find()
            .populate("event", "name date time place")
            .sort({ createdAt: -1 });

        if (registrations.length === 0) {
            return res.status(400).json({ msg: "no registrations found" });
        }

        // group counts by event for a quick summary
        const summaryMap = new Map();
        registrations.forEach((reg) => {
            const eventId = reg.event?._id?.toString();
            if (!eventId) return;
            if (!summaryMap.has(eventId)) {
                summaryMap.set(eventId, {
                    eventId,
                    eventName: reg.event.name,
                    count: 0,
                });
            }
            summaryMap.get(eventId).count += 1;
        });

        return res.status(200).json({
            msg: "Registrations Fetched Successfully",
            totalRegistrations: registrations.length,
            summary: Array.from(summaryMap.values()),
            registrations,
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ msg: "Internal Server Error" });
    }
};

const getRegistrationsByEvent = async (req, res) => {
    try {
        const eventId = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(eventId)) {
            return res.status(400).json({ msg: "Invalid Event Id" });
        }

        const eventExists = await eventModel.findById(eventId);
        if (!eventExists) {
            return res.status(404).json({ msg: "Event not found" });
        }

        const registrations = await eventRegistrationModel
            .find({ event: eventId })
            .populate("event", "name date time place")
            .sort({ createdAt: -1 });

        if (registrations.length === 0) {
            return res.status(400).json({ msg: "no registrations found for this event" });
        }

        return res.status(200).json({
            msg: "Registrations Fetched Successfully",
            totalRegistrations: registrations.length,
            registrations,
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ msg: "Internal Server Error" });
    }
};

const deleteRegistration = async (req, res) => {
    try {
        const registrationId = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(registrationId)) {
            return res.status(400).json({ msg: "Invalid Registration Id" });
        }

        const deletedRegistration = await eventRegistrationModel.findByIdAndDelete(registrationId);

        if (!deletedRegistration) {
            return res.status(400).json({ msg: "registration not found" });
        }

        return res.status(200).json({ msg: "registration deleted successfully" });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ msg: "Internal Server Error" });
    }
};

module.exports = {
    addRegistration,
    getAllRegistrations,
    getRegistrationsByEvent,
    deleteRegistration,
};