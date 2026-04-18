const Enrollment = require("../models/enrollmentModel");  //import enrollment from models
const mongoose = require("mongoose");            //import mongoose


// this api is used to buy course
const buyCourse = async (req, res) => {         //Async function to handle API request
    try{
        const {userId, courseId} = req.body;   //Extract userId and courseId from URL

        //Check already purchased
        const existing = await Enrollment.findOne({ userId, courseId });

        if (existing) {
          return res.status(400).json({message: "Course already purchased"});
        }

        //Create new enrollment
        const data = await Enrollment.create({ userId, courseId });

       res.status(201).json({ message: "course purchased successfully",data});

    }catch(error){
        console.log(error);
        res.status(500).json({msg:"Internal Server Error"});
    }
}


// This API retrieves all courses that a specific user (student) has purchased or enrolled in.
// It queries the Enrollment collection and uses populate() to return full course details instead of just course IDs.
const getUserCourses = async (req, res) => {   //Async function to handle API request
  const { userId } = req.params;        //Extract userId from URL
   const data = await Enrollment.find({ userId })  //Find all enrollments of the user
    .populate("courseId");                   //  Replace courseId with full course details 
     if(data.length === 0){
      return res.status(400).json({msg:"he didn't bought any courses"});
   }              
   res.status(200).json({msg:"Courses: ",data});    //Send response to client
};
// Uses populate("courseId") to fetch course details
// userId must be a valid MongoDB ObjectId


// This API retrieves all students who have purchased/enrolled in a specific course.
// It uses the Enrollment collection to find users linked to the given course and returns full user details using populate().
const getCourseStudents = async (req, res) => {    //Async function to handle API request
  const { courseId } = req.params;  //Extract courseId from URL
   const data = await Enrollment.find({ courseId })  // Find all enrollments for that course
   .populate("userId");                              //Replace userId with full user data
   if(data.length === 0){
      return res.status(400).json({msg:"no one bought this course"});
   }
   return res.status(200).json({msg:"students: ",data});   //Send response to client
};
// populate("userId") is used to fetch student details
// Ensure courseId is a valid MongoDB ObjectId
// Returns empty array [] if no students found

module.exports = {buyCourse, getUserCourses, getCourseStudents};