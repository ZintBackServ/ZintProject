// categoryRoutes.js
const express = require("express");
const router  = express.Router();
const {
  addCategory, getAllCategories, getCategoryById,
  updateCategory, deleteCategory,
} = require("../controllers/categoryController");

router.post("/addCategory",          addCategory);
router.get("/getAllCategories",       getAllCategories);
router.get("/getCategoryById/:id",   getCategoryById);
router.put("/updateCategory/:id",    updateCategory);
router.delete("/deleteCategory/:id", deleteCategory);

module.exports = router;