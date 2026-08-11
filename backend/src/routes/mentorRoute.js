const express = require("express");
const router = express.Router();
const {addMentor, getAllMentor, deleteMentor, getMentorById, UpdateMentor} = require("../controllers/mentorController");
const upload = require("../middlewares/multerMiddleware");
const authentication = require("../middlewares/authMiddleware");
const authorization  = require("../middlewares/authorization");

// Public: anyone can view mentors
router.get("/allMentor", getAllMentor);
router.get("/mentorById/:id", getMentorById);

// Admin only: add, update, delete
router.post("/addmentor",
  authentication, authorization("admin"),
  upload.fields([{ name: "profileImage", maxCount: 1 }]),
  addMentor
);
router.put("/UpdateMentor/:id",
  authentication, authorization("admin"),
  upload.fields([{ name: "profileImage", maxCount: 1 }]),
  UpdateMentor
);
router.delete("/deleteMentor/:id", authentication, authorization("admin"), deleteMentor);

module.exports = router;