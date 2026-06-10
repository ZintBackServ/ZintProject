const mongoose = require("mongoose");
const placedStudentSchema = new mongoose.Schema(
    {
        name:{
            type:String,
            required:true,
            trim:true,
            index:true
        },
        course: {
           type: String, // e.g. ["Web Developer", "Data Science", "DSA"]
           required: true
        },
        company: {
            type: String // years
        },
        package: {
          type: String
        },
        profileImage: {
          type: String, // image URL (from backend/cloud)
          required: true 
        },
        logoImage: {
          type: String, // logo URL (from backend/cloud) 
        }


    },
    {timestaps:true}
);

module.exports = mongoose.model("placedStudent", placedStudentSchema);