const express = require("express");
const router = express.Router();
const {addPlacedStudent, getAllPlacedStudent, deletePlacedStudent, getPlacedStudentById} = require("../controllers/placedStudentController");
const upload = require("../middlewares/multerMiddleware");
const authentication = require("../middlewares/authMiddleware");
const authorization  = require("../middlewares/authorization");

// Public — anyone can view placed students
router.get("/allPlacedStudent", getAllPlacedStudent);
router.get("/getPlacedStudentById/:id", getPlacedStudentById);

// Admin only — add and delete
router.post("/addPlacedStudent",
  authentication, authorization("admin"),
  upload.fields([
    { name: "profileImage", maxCount: 1 },
    { name: "logoImage",    maxCount: 1 },
  ]),
  addPlacedStudent
);
router.delete("/deletePlacedStudent/:id", authentication, authorization("admin"), deletePlacedStudent);

module.exports = router;