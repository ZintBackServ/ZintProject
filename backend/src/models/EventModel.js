const mongoose = require("mongoose");
const eventSchema = new mongoose.Schema(
    {
        name:{
            type:String,
            required:true,
            trim:true,
            index:true
        },
        about: {
           type: String,
            required:true,
        },
        date: {
            type: String,
            required:true,
        },
        time: {
          type: String,
          required:true,
        },
        place: {
            type: String,
            required:true,
        },
        eventImage: {
          type: String, // image URL (from backend/cloud)
          required: true 
        },

    },
    {timestaps:true}
);

module.exports = mongoose.model("Event", eventSchema);