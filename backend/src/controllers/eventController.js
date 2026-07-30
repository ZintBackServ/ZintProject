const eventModel = require("../models/eventModel");
const { uploadOnCloudinary } = require("../utils/cloudinary");
const mongoose = require("mongoose");

const {
    isValid,
} = require("../utils/validator"); // import validation functions

const addEvent = async (req, res) => {
    try {

        const { name, about, date, time, place, speakers, isRegistrationOpen } = req.body;

        //name validation
        if (!isValid(name)) {
            return res.status(400).json({ msg: "Event Name is Missing Or Invalid" });
        }
        //about validation
        if (!isValid(about)) {
            return res.status(400).json({ msg: "about is Missing Or Invalid" });
        }
        //date validation
        if (!isValid(date)) {
            return res.status(400).json({ msg: "date is Missing Or Invalid" });
        }
        //time validation
        if (!isValid(time)) {
            return res.status(400).json({ msg: "time is Missing Or Invalid" });
        }
        //place validation
        if (!isValid(place)) {
            return res.status(400).json({ msg: "place is Missing Or Invalid" });
        }

        if (!req.files || !req.files.eventImage) {
            return res.status(400).json({ msg: "Event Image is needed" });
        }

        const profileLocalPath = req.files.eventImage[0].path;

        const eventImage = await uploadOnCloudinary(profileLocalPath);

        if (!eventImage) {
            return res.status(400).json({ msg: "Event Image upload is failed" });
        }

        // speakers is optional: accept array, comma-separated string, or omit
        let speakersArray = [];
        if (speakers) {
            if (Array.isArray(speakers)) {
                speakersArray = speakers.map((s) => s.trim()).filter(Boolean);
            } else if (typeof speakers === "string") {
                speakersArray = speakers
                    .split(",")
                    .map((s) => s.trim())
                    .filter(Boolean);
            }
        }

        const event = await eventModel.create({
            name,
            about,
            date,
            time,
            place,
            eventImage: eventImage.url,
            speakers: speakersArray,
            ...(isRegistrationOpen !== undefined && {
                isRegistrationOpen: isRegistrationOpen === "false" ? false : Boolean(isRegistrationOpen),
            }),
        });

        const createdEvent = await eventModel.findById(event._id);

        if (!createdEvent) {
            return res.status(500).json({ msg: "something went wrong while creating the Event" });
        }

        return res.status(201).json({ msg: "new event added successfully", createdEvent });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ msg: "Internal Server Error" });
    }
};

const getAllEvent = async (req, res) => {
    try {
        const events = await eventModel.find();
        if (events.length === 0) {
            return res.status(400).json({ msg: "no events found" });
        }
        return res.status(200).json({
            msg: "Events Fetched Successfully",
            totalEvents: events.length,
            events: events,
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ msg: "Internal Server Error" });
    }
};

const deleteEvent = async (req, res) => {
    try {
        let eventId = req.params.id || req.id;
        if (!mongoose.Types.ObjectId.isValid(eventId)) {
            return res.status(400).json("Invalid Event Id");
        }
        let deleteEvent = await eventModel.findByIdAndDelete(eventId);
        if (!deleteEvent) {
            return res.status(400).json({ msg: "event not found" });
        }
        return res.status(200).json({ msg: "event deleted successfully" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ msg: "Internal Server Error" });
    }
};


const getEventByName = async (req, res) => {
    try {
        const name = req.params.name || req.query.name;

        if (!isValid(name)) {
            return res.status(400).json({ msg: "Event Name is Missing Or Invalid" });
        }

        // cap search term length — a very long input makes the regex expensive
        // to evaluate against every document and is a cheap thing for a client to abuse
        const trimmedName = name.trim().slice(0, 100);

        // case-insensitive partial match, escape regex special chars for safety
        // (prevents both regex-injection and ReDoS from crafted patterns like "(a+)+$")
        const safeName = trimmedName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

        const events = await eventModel
            .find({ name: { $regex: safeName, $options: "i" } })
            .limit(20)
            .lean(); // skip Mongoose document overhead — this is a read-only response

        if (events.length === 0) {
            return res.status(404).json({ msg: "no events found" });
        }

        return res.status(200).json({
            msg: "Events Fetched Successfully",
            totalEvents: events.length,
            events: events,
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ msg: "Internal Server Error" });
    }
};


const updateEvent = async (req, res) => {
    try {

        let eventId = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(eventId)) {
            return res.status(400).json({ msg: "Invalid Id" });
        }

        const existingEvent = await eventModel.findById(eventId);
        if (!existingEvent) {
            return res.status(400).json({ msg: "event not found" });
        }

        const {
            name,
            about,
            date,
            time,
            place,
            speakers,
            isRegistrationOpen,
        } = req.body || {};

        const updateData = {};

        // Only validate + apply fields that were actually sent (partial update friendly)
        if (name !== undefined) {
            if (!isValid(name)) {
                return res.status(400).json({ msg: "Event Name is Missing Or Invalid" });
            }
            updateData.name = name;
        }

        if (about !== undefined) {
            if (!isValid(about)) {
                return res.status(400).json({ msg: "about is Missing Or Invalid" });
            }
            updateData.about = about;
        }

        if (date !== undefined) {
            if (!isValid(date)) {
                return res.status(400).json({ msg: "date is Missing Or Invalid" });
            }
            updateData.date = date;
        }

        if (time !== undefined) {
            if (!isValid(time)) {
                return res.status(400).json({ msg: "time is Missing Or Invalid" });
            }
            updateData.time = time;
        }

        if (place !== undefined) {
            if (!isValid(place)) {
                return res.status(400).json({ msg: "place is Missing Or Invalid" });
            }
            updateData.place = place;
        }

        if (speakers !== undefined) {
            if (Array.isArray(speakers)) {
                updateData.speakers = speakers.map((s) => s.trim()).filter(Boolean);
            } else if (typeof speakers === "string") {
                updateData.speakers = speakers
                    .split(",")
                    .map((s) => s.trim())
                    .filter(Boolean);
            }
        }

        if (isRegistrationOpen !== undefined) {
            updateData.isRegistrationOpen =
                isRegistrationOpen === "false" ? false : Boolean(isRegistrationOpen);
        }

        // updated image
        if (req.files && req.files.eventImage) {
            const profileLocalPath = req.files.eventImage[0].path;

            const eventImage = await uploadOnCloudinary(profileLocalPath);

            if (!eventImage) {
                return res.status(400).json({ msg: "event image upload failed" });
            }

            updateData.eventImage = eventImage.secure_url;
        }

        let updatedEvent = await eventModel.findByIdAndUpdate(eventId, updateData, { new: true });

        if (!updatedEvent) {
            return res.status(400).json({ msg: "event not found" });
        }

        return res.status(200).json({ msg: "event updated successfully", updatedEvent });
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: "Internal Server Error" });
    }
};

module.exports = { addEvent, getAllEvent, deleteEvent, getEventByName, updateEvent };