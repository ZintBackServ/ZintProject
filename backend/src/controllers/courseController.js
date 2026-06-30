// courseController.js
const courseModel    = require("../models/courseModel");
const categoryModel  = require("../models/categoryModel");
const mongoose       = require("mongoose");
const { uploadOnCloudinary } = require("../utils/cloudinary");
const { courseValidation }   = require("../utils/validator");

async function validation(key, value, reply) {
  if (!courseValidation[key]) return;
  if (!courseValidation[key](value)) {
    reply.push(`Enter valid ${key}`);
  }
}

// ── POST /addCourse ──────────────────────────────────────────────────────────
const addCourse = async (req, res) => {
  try {
    if (!req.body || Object.keys(req.body).length === 0)
      return res.status(400).json({ msg: "Bad Request, No Data Provided" });

    // if (!req.files || !req.files.courseImage)
    //   return res.status(400).json({ msg: "Course image is required" });

    // 1. Validate category exists before doing anything else
    const { category: categoryId } = req.body;


    console.log(req.body)
    // return res.status(200).json({ msg: "all is well" });

    if (!categoryId || !mongoose.Types.ObjectId.isValid(categoryId))
      return res.status(400).json({ msg: "Valid category ID is required" });

    const category = await categoryModel.findById(categoryId);
    if (!category)
      return res.status(404).json({ msg: "Category not found" });

    // 2. Validate other fields
    const keys   = Object.keys(req.body);
    const values = Object.values(req.body);
    let reply    = [];
    for (let i = 0; i < keys.length; i++) {
      await validation(keys[i], values[i], reply);
    }
    if (reply.length !== 0)
      return res.status(400).json({ msg: reply });

    // 3. Upload course image (required)

    console.log(req.files)
    const imageLocalPath = req.files === {} ? req?.files?.courseImage[0].path : null;
    const courseImage    = imageLocalPath ? await uploadOnCloudinary(imageLocalPath) : null;
    // if (!courseImage)
    //   return res.status(400).json({ msg: "Course image upload failed" });

    // 4. Upload certificate image (optional)
    let courseCertificateUrl = null;
    if (req.files?.courseCertificate) {
      const cert = await uploadOnCloudinary(req.files.courseCertificate[0].path);
      if (!cert) return res.status(400).json({ msg: "Certificate image upload failed" });
      courseCertificateUrl = cert.url;
    }

    // 5. Upload curriculum PDF (optional)
    let courseCurriculumUrl = null;
    if (req.files?.courseCurriculum) {
      const pdf = await uploadOnCloudinary(req.files.courseCurriculum[0].path, "raw");
      if (!pdf) return res.status(400).json({ msg: "Curriculum PDF upload failed" });
      courseCurriculumUrl = pdf.url;
    }

    // 6. Build and save course
    const courseData = {
      ...req.body,
      courseImage: courseImage?.url ?? null,
      trending: req.body.trending === "true",
      fee:      Number(req.body.fee),
      online_fee:      Number(req.body.online_fee),
      ...(courseCertificateUrl && { courseCertificate: courseCertificateUrl }),
      ...(courseCurriculumUrl  && { courseCurriculum:  courseCurriculumUrl  }),
    };

    const course = await courseModel.create(courseData);

    // 7. Push course _id into category.courses[]
    await categoryModel.findByIdAndUpdate(
      categoryId,
      { $push: { courses: course._id } }
    );

    const createdCourse = await courseModel
      .findById(course._id)
      .populate("category", "categoryName");

    return res.status(201).json({ msg: "New course created successfully", Data: createdCourse });

  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Internal Server Error", error: error.message });
  }
};

// ── GET /getAllCourse ─────────────────────────────────────────────────────────
const getAllCourse = async (req, res) => {
  try {
    const courses = await courseModel
      .find()
      .populate("category");
    return res.status(200).json({ msg: "Courses fetched successfully", courses });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

// ── GET /getCourseById/:id ────────────────────────────────────────────────────
const getCourseById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ msg: "Invalid Id" });

    const course = await courseModel
      .findById(id)
      .populate("category", "categoryName");
    if (!course)
      return res.status(404).json({ msg: "Course not found" });

    return res.status(200).json({ msg: "Course fetched successfully", course });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

// ── PUT /updateCourse/:id ─────────────────────────────────────────────────────
const updateCourse = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ msg: "Invalid Id" });

    if (!req.body || Object.keys(req.body).length === 0)
      return res.status(400).json({ msg: "Bad Request, No Data Provided." });

    // If category is being changed — update both old and new category's courses[]
    if (req.body.category) {
      if (!mongoose.Types.ObjectId.isValid(req.body.category))
        return res.status(400).json({ msg: "Valid category ID is required" });

      const newCategory = await categoryModel.findById(req.body.category);
      if (!newCategory)
        return res.status(404).json({ msg: "Category not found" });

      const existingCourse = await courseModel.findById(id);
      if (existingCourse && String(existingCourse.category) !== String(req.body.category)) {
        // Remove from old category
        await categoryModel.findByIdAndUpdate(
          existingCourse.category,
          { $pull: { courses: existingCourse._id } }
        );
        // Add to new category
        await categoryModel.findByIdAndUpdate(
          req.body.category,
          { $push: { courses: existingCourse._id } }
        );
      }
    }

    // Validate fields
    const keys = Object.keys(req.body);
    let reply  = [];
    for (let i = 0; i < keys.length; i++) {
      await validation(keys[i], req.body[keys[i]], reply);
    }
    if (reply.length !== 0)
      return res.status(400).json({ msg: reply });

    const courseData = {
      ...req.body,
      trending: req.body.trending === "true",
      fee:      Number(req.body.fee),
    };

    if (req.files?.courseImage) {
      const img = await uploadOnCloudinary(req.files.courseImage[0].path);
      if (!img) return res.status(400).json({ msg: "Course image upload failed" });
      courseData.courseImage = img.url;
    }

    if (req.files?.courseCertificate) {
      const cert = await uploadOnCloudinary(req.files.courseCertificate[0].path);
      if (!cert) return res.status(400).json({ msg: "Certificate image upload failed" });
      courseData.courseCertificate = cert.url;
    }

    if (req.files?.courseCurriculum) {
      const pdf = await uploadOnCloudinary(req.files.courseCurriculum[0].path, "raw");
      if (!pdf) return res.status(400).json({ msg: "Curriculum PDF upload failed" });
      courseData.courseCurriculum = pdf.url;
    }

    const updatedCourse = await courseModel
      .findByIdAndUpdate(id, courseData, { new: true })
      .populate("category", "categoryName");

    if (!updatedCourse)
      return res.status(404).json({ msg: "Course not found" });

    return res.status(200).json({ msg: "Course updated successfully", updatedCourse });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

// ── DELETE /deleteCourse/:id ──────────────────────────────────────────────────
const deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ msg: "Invalid Id" });

    const course = await courseModel.findByIdAndDelete(id);
    if (!course)
      return res.status(404).json({ msg: "Course not found" });

    // Pull course _id out of its category's courses[]
    await categoryModel.findByIdAndUpdate(
      course.category,
      { $pull: { courses: course._id } }
    );

    return res.status(200).json({ msg: "Course deleted successfully", course });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

module.exports = { addCourse, getAllCourse, updateCourse, getCourseById, deleteCourse };