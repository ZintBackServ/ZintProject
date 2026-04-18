const mongoose = require("mongoose");
const courseSchema = new mongoose.Schema(
    { 
      courseImage:{
         type: String,
         required: true,
         trim:true,
      },   
      courseName:{
         type: String,
         required: true,
         trim:true,
      }, 
      duration:{
         type: String,
         required: true,
         trim:true,
      }, 
      fee:{
         type: Number,
         required: true,
         trim:true,
      }, 
      about:{
         type: String,
         required: true,
         trim:true,
      },  


    }
)

module.exports = mongoose.model("Course", courseSchema);