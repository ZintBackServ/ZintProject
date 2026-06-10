const eventModel = require("../models/EventModel"); 
const {uploadOnCloudinary} = require("../utils/cloudinary");
const mongoose = require("mongoose");

const {
    isValid,
} = require("../utils/validator"); // import validation functions

const addEvent = async (req, res) =>{
    try{

        const {name, about, date, time, place } = req.body
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
        console.log(req.files);
        const profileLocalPath =  req.files.eventImage[0].path;

       const eventImage =  await uploadOnCloudinary(profileLocalPath);

       if(!eventImage){
         return res.status(400).json({ msg: "Event Image upload is failed" });
       }

       const event = await eventModel.create({
         name,
         about,
         date, 
         time,
         place,
         eventImage: eventImage.url,
       })

       const createdEvent = await eventModel.findById(event._id);

       if(!createdEvent){
         return res.status(500).json({ msg: "something went wrong while creating the Event" });
       }
       
        return res.status(201).json({ msg: "new event added successfully", createdEvent });

    }catch(error){
        console.log(error);
        return res.status(500).json({msg:"Internal Server Error"});
    }
}

const getAllEvent = async (req, res) => {
    try{
        const events = await eventModel.find();
                if(events.length === 0 ){
                     return res.status(400).json({msg:"no events found"});
                }
                return res.status(200).json({
                     msg:"Events Fetched Successfully",  totalEvents: events.length,
                     events:events,
                });

    }catch(error){
        console.log(error);
        return res.status(500).json({msg:"Internal Server Error"});
    }
}

const deleteEvent = async (req, res) =>{
    try{
          let eventId = req.params.id || req.id;
         if(!mongoose.Types.ObjectId.isValid(eventId)){
             return res.status(400).json("Invalid Event Id");
          }
          let deleteEvent = await eventModel.findByIdAndDelete(eventId);
         if(!deleteEvent){
             return res.status(400).json({msg:"event not found"});
            }
         return res.status(200).json({msg:"event deleted successfully"});
    }catch(error){
        console.log(error);
        return res.status(500).json({msg:"Internal Server Error"})
    }
}

const getEventById = async (req,res) => {
   try{
    let eventId = req.params.id;
    if(!mongoose.Types.ObjectId.isValid(eventId)){
        return res.status(400).json({msg:"Invalid Id"});
    }
    const event = await eventModel.findById(eventId);
    if(!event){
        return res.status(400).json({msg:"event not found"});
    }
    return res.status(200).json({msg:"event: ", event});

   }catch(error){
    console.log(error);
    return res.status(500).json({msg:"Internal Server Error"});
   }
}

const updateEvent = async (req, res) => {
    try{
       
        let eventId = req.params.id;
      
        if(!mongoose.Types.ObjectId.isValid(eventId)){
         return res.status(400).json({msg:"Invalid Id"});
        }
        
        const { 
         name,
         about,
         date, 
         time,
         place, 
        } = req.body || {};

        if (!name || !about || !date || !time || !place) {
          return res.status(400).json({ msg: "Required fields missing" });
        }

        // Validation
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
        
   
        const EventData = await eventModel.create({
        mentorName,
        expertise,
        experience,
        bio,
       })

        //updatefile
        if (req.files && req.files.eventImage) {
          const profileLocalPath = req.files.eventImage[0].path;

          const eventImage = await uploadOnCloudinary(profileLocalPath);

          if (!eventImage) {
             return res.status(400).json({ msg: "event image upload failed" });
          }

          EventData.eventImage = eventImage.secure_url;
        }

   
        let updateEvent = await eventModel.findByIdAndUpdate(eventId, EventData, { new: true });
    
        if(!updateEvent){
           return res.status(400).json({msg:"event not found"});
        }
     
        return res.status(200).json({msg:"user updated successfully", updateEvent});
    }catch(error){
    console.log(error);
    res.status(500).json({msg:"Internal Server Error"});
   }
}



module.exports = {addEvent, getAllEvent, deleteEvent, getEventById, updateEvent};