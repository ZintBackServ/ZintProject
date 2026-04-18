const courseModel = require("../models/courseModel");
const mongoose = require("mongoose");

const {courseValidation} = require("../utils/validator");

 async function validation(key, value, reply){
    if(!courseValidation[key](value)){
        let error = `enter Valid ${key}`;
        reply.push(error);
    } 
};

//this function is used to add new course 
const addCourse = async (req, res) =>{
    try{
        let reply = [];
        const courseData = req.body;
        const keys = Object.keys(req.body);
        const values = Object.values(req.body);
        const length = Object.keys(req.body).length;
        if(length === 0){
            return res.status(400).json({msg:"Bad Request, No Data Provided"});
        }

        for(let i=0; i<length; i++){
            await validation(keys[i], values[i], reply);
        }

        if(reply.length != 0){
           return  res.status(400).json({msg:reply})
        }

        let course = await courseModel.create(courseData);
        return res.status(201).json({msg:"new course created successfully",Data: course});

    }catch(error){
        console.log(error);
        return res.status(500).json({msg:"Internal Server Error"});
    }
}

//this function is used to get all course
const getAllCourse = async (req, res) =>{
    try{
        const courses = await courseModel.find();
        if(courses.length === 0 ){
             return res.status(400).json({msg:"no courses found"});
        }
        return res.status(200).json({msg:"courses: ",courses});
    }catch(error){
        console.log(error);
        return res.status(500).json({msg:"Internal Server Erorr"});
    }
}


//this function is used to update course
const updateCourse = async (req, res) => {
    try{
        let reply = [];
        const id = req.params.id;
        const courseData = req.body;
        if(!mongoose.Types.ObjectId.isValid(id)){
            return res.status(400).json({msg:"Invalid Id"});
        }
        const keys = Object.keys(req.body);
        const values = Object.values(req.body);
        const length = Object.keys(courseData).length;
        if(length === 0){
           return  res.status(400).json({msg:"bad Request, No Data Provided."});
        }
        //validation
        for(let i = 0 ; i<length; i++){
          await validation(keys[i], values[i], reply);
        }
        if(reply.length != 0){
            return res.status(400).json({msg:reply});
        }
        const updateCourse = await courseModel.findByIdAndUpdate(id, courseData,{returnDocument: 'after'});
        if(!updateCourse){
            return res.status(400).json({msg:"user not found"});
        }
        return res.status(200).json({msg:"user updated successfully"});
    }catch(error){
        console.log(error);
        return res.status(500).json({msg:"Internal Server Error"});
    }
}

// this function is used to find course by id
const getCourseById = async (req,res) => {
   try{
    let id = req.params.id;
    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(400).json({msg:"Invalid Id"});
    }
    const course = await courseModel.findById(id);
    if(!course){
        return res.status(400).json({msg:"course not found"});
    }
    return res.status(200).json({msg:"course: ",course});

   }catch(error){
    console.log(error);
    return res.status(500).json({msg:"Internal Server Error"});
   }
}

//this function is used to delete the course
const deleteCourse = async (req, res) => {
  try{
    let id = req.params.id;
    if(!mongoose.Types.ObjectId.isValid(id)){
       return res.status(400).json({msg:"Invalid Id"});
    }
    let course = await courseModel.findByIdAndDelete(id);
    if(!course){
       return res.status(400).json({msg:"Course Not Found"});
    }
    return res.status(200).json({msg:"Course deleted successfully"});
  }catch(error){
    console.log(error);
    return res.status(500).json({msg:"Internal Server Error"})
  }
}

module.exports = {addCourse, getAllCourse, updateCourse, getCourseById, deleteCourse};