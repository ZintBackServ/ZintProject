const express = require("express");
const router = express.Router();

const { buyCourse, getUserCourses, getCourseStudents} = require("../controllers/enrollmentController");

router.post("/buyCourse", buyCourse);
router.get("/getUserCourses/:userId", getUserCourses);
router.get("/getCourseStudents/:courseId", getCourseStudents);

module.exports = router;