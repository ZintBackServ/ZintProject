const express = require("express");
const router  = express.Router();
const { addCourse, getAllCourse, updateCourse, getCourseById, deleteCourse } = require("../controllers/courseController");
const upload  = require("../middlewares/multerMiddleware");

// ── POST /addCourse ──
// accepts: courseImage (required image) + courseCurriculum (optional PDF)
router.post("/addCourse",
  upload.fields([
    { name: "courseImage",      maxCount: 1 }, // required — course thumbnail
    { name: "courseCertificate",      maxCount: 1 }, // required — course certificate
    { name: "courseCurriculum", maxCount: 1 }, // optional — curriculum PDF
  ]),
  addCourse
);

// ── GET /getAllCourse ──
router.get("/getAllCourse", getAllCourse);

// ── GET /getCourseById/:id ──
router.get("/getCourseById/:id", getCourseById);

// ── PUT /updateCourse/:id ──
// accepts: courseImage (optional new image) + courseCurriculum (optional new PDF)
router.put("/updateCourse/:id",
  upload.fields([
    { name: "courseImage",      maxCount: 1 }, // optional — replace image
    { name: "courseCurriculum", maxCount: 1 }, // optional — replace PDF
  ]),
  updateCourse
);

// ── DELETE /deleteCourse/:id ──
router.delete("/deleteCourse/:id", deleteCourse);

module.exports = router;
