const express = require("express");
const router = express.Router();
const {addCourse, getAllCourse, updateCourse, getCourseById, deleteCourse} = require("../controllers/courseController");

router.post("/addCourse", addCourse);
router.get("/getAllCourse", getAllCourse);
router.put("/updateCourse/:id", updateCourse);
router.get("/getCourseById/:id", getCourseById);
router.delete("/deleteCourse/:id", deleteCourse);

module.exports = router;