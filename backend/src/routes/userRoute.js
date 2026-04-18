const express = require("express");
const router = express.Router();

const {signUpUser, loginUser, getAllUser, getUserById, getUsersByIDs, UpdateUser, deleteUser} = require("../controllers/userController");

let authentication = require("../middlewares/authMiddleware");

let authorization = require("../middlewares/authorization");

//public Routes
router.post("/newUser", signUpUser);
router.post("/login", loginUser);

//get all user profile(for admin)
router.get("/allUsers",authentication, authorization("admin"), getAllUser);
router.get("/getUserById/:id",authentication, authorization("admin"), getUserById);
router.get("/getUsersByIDs",authentication, authorization("admin"), getUsersByIDs);
router.put("/UpdateUser/:id",authentication, UpdateUser);

//Delete Self
router.delete("/deleteUser/:id", authentication, authorization("admin"), deleteUser);

//Admin delete user
router.delete("/user/:userId", authentication, authorization("admin"), deleteUser);

module.exports = router;