const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
     firstName:{
        type: String,
        required: true,
        trim:true,
     }, 

     lastName:{
        type: String,
        trim:true,
     },

     email:{
        type: String,
        required: true,
        trim: true,
        unique: true,
     },

     contactNo:{
        type:String,
        unique: true,
        required: true,
     },

     address:{
        type: String,
        required: true,
        trim:true,
     },

     city:{
      type: String,
      required: true,
      trim:true,
     },

     state:{
      type:String,
      required:true,
      trim:true,
     },

     password:{
        type:String,
        required:true,
        select:false, //it doesn't show in data
     }, 
     role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    }, 
     refreshToken:{
      type:String
     }
    },
    {timestamps: true}

);

module.exports = mongoose.model("User", userSchema);


