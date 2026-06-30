// categoryController.js
const categoryModel = require("../models/categoryModel");
const mongoose      = require("mongoose");

// POST /addCategory
const addCategory = async (req, res) => {
  try {
    const { categoryName, description } = req.body;
    if (!categoryName?.trim())
      return res.status(400).json({ msg: "Category name is required" });

    const exists = await categoryModel.findOne({ categoryName: categoryName.trim() });
    if (exists)
      return res.status(409).json({ msg: "Category already exists" });

    const category = await categoryModel.create({
      categoryName: categoryName.trim(),
      description:  description?.trim(),
    });

    return res.status(201).json({ msg: "Category created successfully", category });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Internal Server Error", error: error.message });
  }
};

// GET /getAllCategories
const getAllCategories = async (req, res) => {
  try {
    const categories = await categoryModel
      .find({ isActive: true })
      .populate("courses", "courseName fee mode trending courseImage");
    return res.status(200).json({ msg: "Categories fetched successfully", categories });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

// GET /getCategoryById/:id
const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ msg: "Invalid Id" });

    const category = await categoryModel
      .findById(id)
      .populate("courses", "courseName fee mode trending courseImage");
    if (!category)
      return res.status(404).json({ msg: "Category not found" });

    return res.status(200).json({ msg: "Category fetched successfully", category });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

// PUT /updateCategory/:id
const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ msg: "Invalid Id" });

    if (!req.body || Object.keys(req.body).length === 0)
      return res.status(400).json({ msg: "No data provided" });

    const updated = await categoryModel
      .findByIdAndUpdate(id, { ...req.body }, { new: true, runValidators: true })
      .populate("courses", "courseName fee mode trending courseImage");
    if (!updated)
      return res.status(404).json({ msg: "Category not found" });

    return res.status(200).json({ msg: "Category updated successfully", category: updated });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Internal Server Error", error: error.message });
  }
};

// DELETE /deleteCategory/:id  (soft delete)
const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ msg: "Invalid Id" });

    const deleted = await categoryModel.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    );
    if (!deleted)
      return res.status(404).json({ msg: "Category not found" });

    return res.status(200).json({ msg: "Category deleted successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

module.exports = { addCategory, getAllCategories, getCategoryById, updateCategory, deleteCategory };