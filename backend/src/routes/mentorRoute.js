const express = require("express");
const router = express.Router();
const {addMentor, getAllMentor, deleteMentor, getMentorById, UpdateMentor} = require("../controllers/mentorController");
const upload = require("../middlewares/multerMiddleware")
router.post("/addmentor",upload.fields([
    {
        name:"profileImage",
        maxCount:1
    }
]),addMentor);

router.get("/allMentor",getAllMentor);
router.delete("/deleteMentor/:id",deleteMentor);
router.get("/mentorById/:id",getMentorById);
router.put("/UpdateMentor/:id",
    upload.fields([{ name: "profileImage", maxCount: 1 }]),
    UpdateMentor);

module.exports = router;