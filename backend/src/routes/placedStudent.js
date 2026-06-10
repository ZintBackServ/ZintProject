const express = require("express");
const router = express.Router();
const {addPlacedStudent, getAllPlacedStudent, deletePlacedStudent, getPlacedStudentById} = require("../controllers/placedStudentController");
const upload = require("../middlewares/multerMiddleware")
router.post("/addPlacedStudent",upload.fields([
    {
        name:"profileImage",
        maxCount:1
    },
    { 
        name: "logoImage", 
        maxCount: 1
    }, 
]),addPlacedStudent);


router.get("/allPlacedStudent",getAllPlacedStudent);
router.delete("/deletePlacedStudent/:id",deletePlacedStudent);
router.get("/getPlacedStudentById/:id",getPlacedStudentById);


module.exports = router;