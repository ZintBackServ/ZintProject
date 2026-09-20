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

    const lastCategory = await categoryModel
      .findOne({ isActive: { $ne: false } })
      .sort({ displayOrder: -1 })
      .select("displayOrder")
      .lean();

    const category = await categoryModel.create({
      categoryName: categoryName.trim(),
      description:  description?.trim(),
      displayOrder: (lastCategory?.displayOrder ?? -1) + 1,
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
      .find({ isActive: { $ne: false } })
      .sort({ displayOrder: 1, createdAt: 1 })
      .populate("courses", "courseName fee mode trending courseImage");
    return res.status(200).json({ msg: "Categories fetched successfully", categories });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

// PUT /reorderCategories
const reorderCategories = async (req, res) => {
  try {
    const { categoryIds } = req.body;
    if (!Array.isArray(categoryIds) || categoryIds.length === 0)
      return res.status(400).json({ msg: "Category order is required" });

    const uniqueIds = [...new Set(categoryIds.map(String))];
    if (uniqueIds.length !== categoryIds.length || uniqueIds.some((id) => !mongoose.Types.ObjectId.isValid(id)))
      return res.status(400).json({ msg: "Invalid category order" });

    const categories = await categoryModel.find({ isActive: { $ne: false } }).select("_id").lean();
    if (categories.length !== uniqueIds.length || categories.some((category) => !uniqueIds.includes(String(category._id))))
      return res.status(400).json({ msg: "The category order must include every active category" });

    await categoryModel.bulkWrite(uniqueIds.map((id, displayOrder) => ({
      updateOne: { filter: { _id: id }, update: { $set: { displayOrder } } },
    })));

    return res.status(200).json({ msg: "Category order updated successfully" });
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

module.exports = { addCategory, getAllCategories, getCategoryById, updateCategory, deleteCategory, reorderCategories };
