const mongoose = require("mongoose");
const courseSchema = new mongoose.Schema(
    { 
      courseImage:{
         type: String,
         required: true,
         trim:true,
      },
      courseCurriculum:{
         type: String,
         trim:true,
      },
       courseCertificate:{
         type: String,
         trim:true,
      },      
      courseName:{
         type: String,
         required: true,
         trim:true,
         index:true
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
      trending:{
         type:Boolean,
         required:true,
      }, 
      mode:{
          type:String,
          required:true,
      }, 
      type:{
          type:String,
          required:true,
      },
      category:{
          type:String,
          required:true,
      },
      subCategory:{
         type:String,
         required:true,  
      },
      startDate:{
         type:String,
      },
      language:{
         type:String,
      },
      rating:{
         type:Number,
         trim:true,
      }
    }
)

module.exports = mongoose.model("Course", courseSchema);