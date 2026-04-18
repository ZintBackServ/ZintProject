const userModel = require("../models/userModel");  //import userModel from model
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const {
    isValid,
    validators,
    isValidEmail,
    isValidPassword,
} = require("../utils/validator"); // import validation functions

const mongoose = require("mongoose");

async function validation(key, data, reply){
    
    if(!validators[key](data)){
      let error = `Enter Valid ${key}` 
      reply.push(error);
    }
    //check duplicate email 
    if(key === "email"){
          //duplicate email
          let duplicateEmail = await userModel.findOne({email:data});
          if(duplicateEmail){
             let error = `Email Already Exists`;
             reply.push(error);
            }
    }

    //check duplicate contact number
    if(key === "contactNo"){
        let duplicateContact = await userModel.findOne({contactNo:data});
        if(duplicateContact){
            let error = `contact Number Already Exists`;
            reply.push(error);
        }
    }
    
}

//SignUp User
// this function used to create new user
// make object in body :
//  {
//     "firstName":"raj",
//     "lastName":"kumar",
//     "email":"raj@gmail.com",
//     "contactNo":"7979547758",
//     "address":"shatabdipuram",
//     "city":"gwalior",
//     "state":"m.p",
//     "password":"Shiv#123"
// }
const signUpUser = async (req, res) => {
    let reply = [];
    try{
         let userData = req.body;
         console.log(req.body);
         const keys = Object.keys(req.body);
        //  console.log("keys",keys);
         const values = Object.values(req.body);
        //  console.log(values);
         const length = Object.keys(userData).length;
        //  console.log(length);
         if(length === 0){
            return res.status(400).json({msg:"Bad Request! No Data Provided."});
         }
        //  let {firstName, lastName, email, contactNo, address, city, state, password} = userData;
         let {password} = userData;
       // Validation
       for(let i = 0 ; i<length;i++ ){ 
         await  validation(keys[i],values[i], reply);
       }
       if(reply.length != 0){
         return res.status(400).json({msg:reply});  
       }
       //password hashing
       let hashedPassword = await bcrypt.hash(password, 10);
      userData.password = hashedPassword;

      userData.role = "user";
       //  reply.length = 0
       let createUser = await userModel.create(userData);
       return res.status(201).json({msg:"user signed up    successfully", data: createUser})
    }catch(error){
        console.log(error);
        return res.status(500).json({msg:"Internal   Server Error"});
    }
}; 

// Login User (Manual)
const loginUser = async (req, res) => {
  try {
    let userdata = req.body;

    // Validation
    if (!userdata || Object.keys(userdata).length === 0) {
      return res.status(400).json({ msg: "Bad Request ! No Data Provided." });
    }

    let { email, password } = userdata;

    if (!isValid(email) || !isValidEmail(email)) {
      return res.status(400).json({ msg: "Email is Missing Or Invalid" });
    }

    if (!isValid(password)) {
      return res.status(400).json({ msg: "Password is Required" });
    }

    let user = await userModel.findOne({ email }).select("+password");
    if (!user) {
      return res.status(404).json({ msg: "User Not Found" });
    }


    let isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(401).json({ msg: "Incorrect Password" });
    }

    let token = jwt.sign(
      {
        userId: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: "24hr",
      }
    );

    return res.status(200).json({ msg: "Login Successful", token });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Internal Server Error", error });
  }
};

//get all user
//this function used to get all users
const getAllUser = async (req, res) => {
     try{
        if (req.userRole !== "admin") {
         return res.status(403).json({ msg: "Access Denied! Admin Only" });
        }
        let users = await userModel.find().sort({ createdAt: -1 });   //It sorts your data based on createdAt field in descending order [ Descending (new → old) ]
        if(users.length === 0 ){
           return  res.status(404).json({msg:"no user found"});
        }
        return res.status(200).json({
            msg:"Users Fetched Successfully",  totalUsers: users.length,
            data:users,
        });

     }catch(error){
        console.log(error);
        res.status(500).json({msg:"Internal Server Error"});
     }

}

//this function  is used to get a single user
// ids: 69ce47476d01c94c0259c0d1
//  json: "user": {
//         "_id": "69ce47476d01c94c0259c0d1",
//         "firstName": "anuj",
//         "lastName": "dubey",
//         "email": "anuj@gmail.com",
//         "contactNo": "9876543021",
//         "address": "dd nagar",
//         "city": "Gwl",
//         "state": "madhya",
//         "password": "Shivam@123",
//         "createdAt": "2026-04-02T10:39:03.070Z",
//         "updatedAt": "2026-04-02T10:39:03.070Z",
//         "__v": 0
//     }
const getUserById = async (req, res) => {
    try{
        let id = req.id;
        if(!mongoose.Types.ObjectId.isValid(id)){
            return res.status(400).json({msg:"Invalid Id"});
        }
        let user = await userModel.findById(id);
        if(!user){
            return res.status(404).json({msg:"user not found"});
        }
        
        return res.status(200).json({msg:"User Profile Fetched Successfully",data:user});

    }catch(error){
        console.log(error);
        res.status(500).json({msg:"Internal Server Error"});
    }
}


//getUsersByIDs
//this function is used to get multiple users by multiple ids
// ids: 69ce47476d01c94c0259c0d1, 69ce47476d01c94c0249c0d1
// json: "user": {
//         "_id": "69ce47476d01c94c0259c0d1",
//         "firstName": "anuj",
//         "lastName": "dubey",
//         "email": "anuj@gmail.com",
//         "contactNo": "9876543021",
//         "address": "dd nagar",
//         "city": "Gwl",
//         "state": "madhya",
//         "password": "Shivam@123",
//         "createdAt": "2026-04-02T10:39:03.070Z",
//         "updatedAt": "2026-04-02T10:39:03.070Z",
//         "__v": 0
//     },
    //    {
//         "_id": "69ce47476d01c94c0249c0d1",
//         "firstName": "anuj",
//         "lastName": "dubey",
//         "email": "anuj@gmail.com",
//         "contactNo": "9876543021",
//         "address": "dd nagar",
//         "city": "Gwl",
//         "state": "madhya",
//         "password": "Shivam@123",
//         "createdAt": "2026-04-02T10:39:03.070Z",
//         "updatedAt": "2026-04-02T10:39:03.070Z",
//         "__v": 0
//     }
// _id: { $in: ids }
// }
const getUsersByIDs = async (req, res ) => {
   try{
       const { ids } = req.body; // array of IDs
        
        let users = await userModel.find({_id: { $in: ids }});
        if(!users){
            return res.status(404).json({msg:"user not found"});
        }
        
        return res.status(200).json({msg:"users:",users})
   }catch(error){
    console.log(error);
    res.status(500).json({msg:"Internal Server Error"});
   }
}

//Update user
//this function is used to update user profile
// pass user id in params 
// pass key and value in body.
const UpdateUser = async (req, res) => {
    try{
        let reply = [];
        let id = req.params.id;
        let userData = req.body;
        if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(400).json({msg:"Invalid Id"});
        }
         const keys = Object.keys(req.body);
         const values = Object.values(req.body);
         const length = Object.keys(userData).length;
         if(length === 0){
            return res.status(400).json({msg:"Bad Request! No Data Provided."});
         }

        // Validation
        for(let i = 0 ; i<length ; i++ ){ 
           await  validation(keys[i],values[i], reply);
        }
        if(reply.length != 0){
          return res.status(400).json({msg:reply});  
        }
   
        let updateUser = await userModel.findByIdAndUpdate(id, userData, { new: true });
    
    if(!updateUser){
        return res.status(400).json({msg:"user not found"});
    }
     
    return res.status(200).json({msg:"user update successfully"});
   }catch(error){
    console.log(error);
    res.status(500).json({msg:"Internal Server Error"});
   }
}

//this function is used to delete user profile
// to delete the user pass id in params to delete that user
const deleteUser = async (req, res) => {
    try{
        let id = req.params.id || req.id;
       if(!mongoose.Types.ObjectId.isValid(id)){
         return res.status(400).json("Invalid User Id");
       }
       let deleteUser = await userModel.findByIdAndDelete(id);
       if(!deleteUser){
          return res.status(400).json({msg:"user not found"});
       }
        return res.status(200).json({msg:"user deleted successfully"});
    }catch(error){
        console.log(error);
        return res.status(500).json({msg:"Interval Server Error"});
    }
}
module.exports= {signUpUser, loginUser, getAllUser, getUserById, getUsersByIDs, UpdateUser, deleteUser};