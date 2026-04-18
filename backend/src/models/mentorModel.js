const mongoose = require("mongoose");
const mentorSchema = new mongoose.Schema(
    {
        mentorName:{
            type:String,
            required:true,
            lowercase:true,
            trim:true,
            index:true
        },
        expertise: {
           type: [String], // e.g. ["React", "Node", "DSA"]
           required: true
        },
        experience: {
            type: String // years
        },
        bio: {
          type: String
        },
        profileImage: {
          type: String, // image URL (from backend/cloud)
          required: true
          
        }

    },
    {timestaps:true}
);

module.exports = mongoose.model("Mentor", mentorSchema);