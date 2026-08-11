const mentorModel = require("../models/mentorModel");  //import mentorModel from model
const {uploadOnCloudinary} = require("../utils/cloudinary");
const mongoose = require("mongoose");

const {
    isValid,
    isValidName,
} = require("../utils/validator"); // import validation functions

const addMentor = async (req, res) =>{
    try{
        const {mentorName, expertise, experience, bio } = req.body
        
        if (!isValid(mentorName)) {
         return res.status(400).json({ msg: "Mentor Name is Missing Or Invalid" });
        }
        if (!isValid(expertise)) {
         return res.status(400).json({ msg: "expertise is Missing Or Invalid" });
        }
        

        if (!req.files || !req.files.profileImage) {
          return res.status(400).json({ msg: "Profile Image is needed" });
        }
        console.log(req.files);
        const profileLocalPath =  req.files.profileImage[0].path;

       const profileImage =  await uploadOnCloudinary(profileLocalPath);

       if(!profileImage){
         return res.status(400).json({ msg: "Profile Image upload is failed" });
       }

       const mentor = await mentorModel.create({
        mentorName,
        expertise,
        experience,
        bio,
        profileImage: profileImage.url,
       })

       const createdMentor = await mentorModel.findById(mentor._id);

       if(!createdMentor){
         return res.status(500).json({ msg: "something went wrong while registering the mentor" });
       }
       
        return res.status(201).json({ msg: "new mentor added successfully", createdMentor });

    }catch(error){
        console.log(error);
        return res.status(500).json({msg:"Internal Server Error"});
    }
}

const getAllMentor = async (req, res) => {
    try{
        const mentors = await mentorModel.find();
        return res.status(200).json({
             msg: "Mentors Fetched Successfully",  
             totalMentor: mentors.length,
             mentors: mentors,
        });
    }catch(error){
        console.log(error);
        return res.status(500).json({msg:"Internal Server Error"});
    }
}

const deleteMentor = async (req, res) =>{
    try{
          let mentorId = req.params.id || req.id;
         if(!mongoose.Types.ObjectId.isValid(mentorId)){
             return res.status(400).json("Invalid User Id");
          }
          let deleteMentor = await mentorModel.findByIdAndDelete(mentorId);
         if(!deleteMentor){
             return res.status(400).json({msg:"mentor not found"});
            }
         return res.status(200).json({msg:"mentor deleted successfully"});
    }catch(error){
        console.log(error);
        return res.status(500).json({msg:"Internal Server Error"})
    }
}

const getMentorById = async (req,res) => {
   try{
    let mentorId = req.params.id;
    if(!mongoose.Types.ObjectId.isValid(mentorId)){
        return res.status(400).json({msg:"Invalid Id"});
    }
    const mentor = await mentorModel.findById(mentorId);
    if(!mentor){
        return res.status(400).json({msg:"mentor not found"});
    }
    return res.status(200).json({msg:"mentor: ",mentor});

   }catch(error){
    console.log(error);
    return res.status(500).json({msg:"Internal Server Error"});
   }
}

const UpdateMentor = async (req, res) => {
    try{
        let mentorId = req.params.id;
      
        if(!mongoose.Types.ObjectId.isValid(mentorId)){
         return res.status(400).json({msg:"Invalid Id"});
        }
        
        const { mentorName, expertise, experience, bio } = req.body || {};

        if (!mentorName || !expertise) {
          return res.status(400).json({ msg: "Required fields missing" });
        }

        if (!isValidName(mentorName)) {
         return res.status(400).json({ msg: "Mentor Name is Missing Or Invalid" });
        }
        if (!isValid(expertise)) {
         return res.status(400).json({ msg: "expertise is Missing Or Invalid" });
        }
   
        const updateFields = {
          mentorName,
          expertise,
          experience: experience || "",
          bio: bio || "",
        };

        // If new profile image uploaded
        if (req.files && req.files.profileImage && req.files.profileImage[0]) {
          const profileLocalPath = req.files.profileImage[0].path;
          const profileImage = await uploadOnCloudinary(profileLocalPath);

          if (!profileImage) {
             return res.status(400).json({ msg: "Profile upload failed" });
          }

          updateFields.profileImage = profileImage.url;
        }

        let updateMentor = await mentorModel.findByIdAndUpdate(mentorId, updateFields, { new: true });
    
        if(!updateMentor){
           return res.status(404).json({msg:"mentor not found"});
        }
     
        return res.status(200).json({msg:"mentor updated successfully", updateMentor});
    }catch(error){
    console.log(error);
    res.status(500).json({msg:"Internal Server Error"});
   }
}



module.exports = {addMentor, getAllMentor, deleteMentor, getMentorById, UpdateMentor};