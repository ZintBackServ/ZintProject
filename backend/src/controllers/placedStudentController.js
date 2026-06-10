const placedStudentModel = require("../models/placedStudentModel");  //import mentorModel from model
const {uploadOnCloudinary} = require("../utils/cloudinary");
const mongoose = require("mongoose");

const {
    isValid,
    isValidName,
} = require("../utils/validator"); // import validation functions

const addPlacedStudent = async (req, res) =>{
    try{
        const {name, course, company, package } = req.body
        
        if (!isValid(name)) {
         return res.status(400).json({ msg: "placed student name is Missing Or Invalid" });
        }
        if (!isValid(course)) {
         return res.status(400).json({ msg: "placed student course is Missing Or Invalid" });
        }
        
        // profile image
        if (!req.files || !req.files.profileImage) {
          return res.status(400).json({ msg: "ProfileImage is needed"});
        }
        console.log(req.files);
        const profileLocalPath =  req.files.profileImage[0].path;

       const profileImage =  await uploadOnCloudinary(profileLocalPath);

       if(!profileImage){
         return res.status(400).json({ msg: "Profile upload is failed" });
       }
        
       //logo image
       if (!req.files || !req.files.logoImage) {
          return res.status(400).json({ msg: "logo Image is needed"});
        }
        console.log(req.files);
        const logoLocalPath =  req.files.logoImage[0].path;

       const logoImage =  await uploadOnCloudinary(logoLocalPath);

       if(!logoImage){
         return res.status(400).json({ msg: "logo upload is failed" });
       }

       const placedStudent = await placedStudentModel.create({
        name,
        course,
        company,
        package,
        profileImage: profileImage.url,
        logoImage: logoImage.url,
       })

       const createdplacedStudent = await placedStudentModel.findById(placedStudent._id);

       if(!createdplacedStudent){
         return res.status(500).json({ msg: "something went wrong while registering the placedStudent" });
       }
       
        return res.status(201).json({ msg: "new placed Student added successfully", createdplacedStudent });

    }catch(error){
        console.log(error);
        return res.status(500).json({msg:"Internal Server Error"});
    }
}

const getAllPlacedStudent = async (req, res) => {
    try{
        const placedStudents = await placedStudentModel.find();
                if(placedStudents.length === 0 ){
                     return res.status(400).json({msg:"no placed students found"});
                }
                return res.status(200).json({
                     msg:"Placed Students Fetched Successfully",  
                     totalPlacedStudents: placedStudents.length,
                     placedStudents:placedStudents,
                });

    }catch(error){
        console.log(error);
        return res.status(500).json({msg:"Internal Server Error"});
    }
}

const deletePlacedStudent = async (req, res) =>{
    try{
          let PlacedStudentsId = req.params.id || req.id;
         if(!mongoose.Types.ObjectId.isValid(PlacedStudentsId)){
             return res.status(400).json("Invalid Placed Student Id");
          }
          let deletePlacedStudent = await placedStudentModel.findByIdAndDelete(PlacedStudentsId);
         if(!deletePlacedStudent){
             return res.status(400).json({msg:"placed student not found"});
            }
         return res.status(200).json({msg:"placed student deleted successfully"});
    }catch(error){
        console.log(error);
        return res.status(500).json({msg:"Internal Server Error"})
    }
}

const getPlacedStudentById = async (req,res) => {
   try{
    let placedStudentById = req.params.id;
    if(!mongoose.Types.ObjectId.isValid(placedStudentById)){
        return res.status(400).json({msg:"Invalid Id"});
    }
    const placedStudent = await placedStudentModel.findById(placedStudentById);
    if(!placedStudent){
        return res.status(400).json({msg:"placed student not found"});
    }
    return res.status(200).json({msg:"Placed Student: ",placedStudent});

   }catch(error){
    console.log(error);
    return res.status(500).json({msg:"Internal Server Error"});
   }
}

// const UpdateMentor = async (req, res) => {
//     try{
       
//         let mentorId = req.params.id;
      
//         if(!mongoose.Types.ObjectId.isValid(mentorId)){
//          return res.status(400).json({msg:"Invalid Id"});
//         }
        
//         const { mentorName, expertise, experience, bio } = req.body || {};

//         if (!mentorName || !expertise) {
//           return res.status(400).json({ msg: "Required fields missing" });
//         }

//         // Validation
//          if (!isValidName(mentorName)) {
//          return res.status(400).json({ msg: "Mentor Name is Missing Or Invalid" });
//         }
//         if (!isValid(expertise)) {
//          return res.status(400).json({ msg: "expertise is Missing Or Invalid" });
//         }
   
//         const MentorData = await mentorModel.create({
//         mentorName,
//         expertise,
//         experience,
//         bio,
//        })

//         //updatefile
//         if (req.files && req.files.profileImage) {
//           const profileLocalPath = req.files.profileImage[0].path;

//           const profileImage = await uploadOnCloudinary(profileLocalPath);

//           if (!profileImage) {
//              return res.status(400).json({ msg: "Profile upload failed" });
//           }

//           MentorData.profileImage = profileImage.secure_url;
//         }

   
//         let updateMentor = await userModel.findByIdAndUpdate(mentorId, MentorData, { new: true });
    
//         if(!updateMentor){
//            return res.status(400).json({msg:"mentor not found"});
//         }
     
//         return res.status(200).json({msg:"user updated successfully", updateMentor});
//     }catch(error){
//     console.log(error);
//     res.status(500).json({msg:"Internal Server Error"});
//    }
// }



module.exports = {addPlacedStudent, getAllPlacedStudent, deletePlacedStudent, getPlacedStudentById};