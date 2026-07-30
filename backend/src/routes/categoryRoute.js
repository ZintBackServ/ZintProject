// // categoryRoutes.js
// const express = require("express");
// const router  = express.Router();
// const {
//   addCategory, getAllCategories, getCategoryById,
//   updateCategory, deleteCategory,
// } = require("../controllers/categoryController");

// router.post("/addCategory",          addCategory);
// router.get("/getAllCategories",       getAllCategories);
// router.get("/getCategoryById/:id",   getCategoryById);
// router.put("/updateCategory/:id",    updateCategory);
// router.delete("/deleteCategory/:id", deleteCategory);

// module.exports = router;



// categoryRoutes.js
const express = require("express");
const router  = express.Router();
const {
  addCategory, getAllCategories, getCategoryById,
  updateCategory, deleteCategory,
} = require("../controllers/categoryController");

// ✅ Single consistent import style
const authentication = require("../middlewares/authMiddleware");
const authorization  = require("../middlewares/authorization");

router.post("/addCategory",          authentication, authorization("admin"), addCategory);
router.get("/getAllCategories",      getAllCategories);
router.get("/getCategoryById/:id",   getCategoryById);
router.put("/updateCategory/:id",    authentication, authorization("admin"), updateCategory);
router.delete("/deleteCategory/:id", authentication, authorization("admin"), deleteCategory);

module.exports = router;