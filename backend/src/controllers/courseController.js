const courseModel = require("../models/courseModel");
const mongoose = require("mongoose");
const { uploadOnCloudinary } = require("../utils/cloudinary");
const { courseValidation }   = require("../utils/validator");

// ── Validation helper ──
async function validation(key, value, reply) {
  if (!courseValidation[key]) return; // skip keys with no validator
  if (!courseValidation[key](value)) {
    reply.push(`Enter valid ${key}`);
  }
}

// ────────────────────────────────────────────
// ADD COURSE   POST /addCourse
// ────────────────────────────────────────────
const addCourse = async (req, res) => {
  try {
    console.log("req.body  →", req.body);
    console.log("req.files →", req.files);

    // 1. Check body not empty
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({ msg: "Bad Request, No Data Provided" });
    }

    // 2. Course image is required
    if (!req.files || !req.files.courseImage) {
      return res.status(400).json({ msg: "Course image is required" });
    }

    // 3. Validate fields BEFORE uploading (avoids wasted Cloudinary calls)
    const keys   = Object.keys(req.body);
    const values = Object.values(req.body);
    const length = keys.length;
    let reply    = [];

    for (let i = 0; i < length; i++) {
      await validation(keys[i], values[i], reply);
    }
    if (reply.length !== 0) {
      return res.status(400).json({ msg: reply });
    }

    // 4. Upload course image (required)
    const imageLocalPath = req.files.courseImage[0].path;
    const courseImage    = await uploadOnCloudinary(imageLocalPath);
    if (!courseImage) {
      return res.status(400).json({ msg: "Course image upload failed" });
    }

    // 5. Upload certificate image (optional)
    let courseCertificateUrl = null;
    if (req.files && req.files.courseCertificate) {
      const certificateLocalPath = req.files.courseCertificate[0].path;
      const courseCertificate    = await uploadOnCloudinary(certificateLocalPath);
      if (!courseCertificate) {
        return res.status(400).json({ msg: "Certificate image upload failed" });
      }
      courseCertificateUrl = courseCertificate.url; // ✅ stored correctly
    }

    // 6. Upload curriculum PDF (optional)
    // Cloudinary "raw" resource_type is required for non-image files like PDFs
    let courseCurriculumUrl = null;
    if (req.files && req.files.courseCurriculum) {
      const pdfLocalPath     = req.files.courseCurriculum[0].path;
      const courseCurriculum = await uploadOnCloudinary(pdfLocalPath, "raw");
      if (!courseCurriculum) {
        return res.status(400).json({ msg: "Curriculum PDF upload failed" });
      }
      courseCurriculumUrl = courseCurriculum.url;
    }

    // 7. Build course object
    const courseData = {
      ...req.body,
      courseImage: courseImage.url,
      trending: req.body.trending === "true",  // FormData sends string → convert to Boolean
      fee: Number(req.body.fee),               // FormData sends string → convert to Number
      // ✅ FIX: both optional URLs now included when available
      ...(courseCertificateUrl && { courseCertificate: courseCertificateUrl }),
      ...(courseCurriculumUrl  && { courseCurriculum:  courseCurriculumUrl  }),
    };

    // 8. Save to DB
    const course        = await courseModel.create(courseData);
    const createdCourse = await courseModel.findById(course._id);

    if (!createdCourse) {
      return res.status(500).json({ msg: "Something went wrong while creating the course." });
    }

    return res.status(201).json({ msg: "New course created successfully", Data: createdCourse });

  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Internal Server Error", error: error.message });
  }
};

// ────────────────────────────────────────────
// GET ALL COURSES   GET /getAllCourse
// ────────────────────────────────────────────
const getAllCourse = async (req, res) => {
  try {
    const courses = await courseModel.find();
    // ✅ always return 200 — empty array is not an error
    return res.status(200).json({ msg: "Courses fetched successfully", courses });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

// ────────────────────────────────────────────
// GET COURSE BY ID   GET /getCourseById/:id
// ────────────────────────────────────────────
const getCourseById = async (req, res) => {
  try {
    const id = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ msg: "Invalid Id" });
    }

    const course = await courseModel.findById(id);
    if (!course) {
      return res.status(404).json({ msg: "Course not found" });
    }

    return res.status(200).json({ msg: "Course fetched successfully", course });

  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

// ────────────────────────────────────────────
// UPDATE COURSE   PUT /updateCourse/:id
// ────────────────────────────────────────────
const updateCourse = async (req, res) => {
  try {
    const id = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ msg: "Invalid Id" });
    }

    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({ msg: "Bad Request, No Data Provided." });
    }

    // Validate fields
    const keys   = Object.keys(req.body);
    const values = Object.values(req.body);
    const length = keys.length;
    let reply    = [];

    for (let i = 0; i < length; i++) {
      await validation(keys[i], values[i], reply);
    }
    if (reply.length !== 0) {
      return res.status(400).json({ msg: reply });
    }

    // Build update data
    const courseData = {
      ...req.body,
      trending: req.body.trending === "true", // string → Boolean
      fee: Number(req.body.fee),              // string → Number
    };

    // Upload new course image if provided
    if (req.files && req.files.courseImage) {
      const imageLocalPath = req.files.courseImage[0].path;
      const courseImage    = await uploadOnCloudinary(imageLocalPath);
      if (!courseImage) {
        return res.status(400).json({ msg: "Course image upload failed" });
      }
      courseData.courseImage = courseImage.url;
    }

    // ✅ FIX: declared courseCertificateUrl AND assigned to courseData
    if (req.files && req.files.courseCertificate) {
      const certificateLocalPath = req.files.courseCertificate[0].path;
      const courseCertificate    = await uploadOnCloudinary(certificateLocalPath);
      if (!courseCertificate) {
        return res.status(400).json({ msg: "Certificate image upload failed" });
      }
      courseData.courseCertificate = courseCertificate.url; // ✅ directly on courseData
    }

    // Upload new curriculum PDF if provided
    // "raw" resource_type needed for Cloudinary to accept PDFs
    if (req.files && req.files.courseCurriculum) {
      const pdfLocalPath     = req.files.courseCurriculum[0].path;
      const courseCurriculum = await uploadOnCloudinary(pdfLocalPath, "raw");
      if (!courseCurriculum) {
        return res.status(400).json({ msg: "Curriculum PDF upload failed" });
      }
      courseData.courseCurriculum = courseCurriculum.url;
    }

    const updatedCourse = await courseModel.findByIdAndUpdate(
      id,
      courseData,
      { new: true } // returns updated document
    );

    if (!updatedCourse) {
      return res.status(404).json({ msg: "Course not found" });
    }

    return res.status(200).json({ msg: "Course updated successfully", updatedCourse });

  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

// ────────────────────────────────────────────
// DELETE COURSE   DELETE /deleteCourse/:id
// ────────────────────────────────────────────
const deleteCourse = async (req, res) => {
  try {
    const id = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ msg: "Invalid Id" });
    }

    const course = await courseModel.findByIdAndDelete(id);
    if (!course) {
      return res.status(404).json({ msg: "Course not found" });
    }

    return res.status(200).json({ msg: "Course deleted successfully", course });

  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

module.exports = { addCourse, getAllCourse, updateCourse, getCourseById, deleteCourse };
