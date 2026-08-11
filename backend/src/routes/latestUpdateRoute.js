const express = require("express");
const router  = express.Router();
const { addUpdate, getAllUpdates, getUpdateById, updateUpdate, deleteUpdate } = require("../controllers/latestUpdateController");
const upload  = require("../middlewares/multerMiddleware");
const authentication = require("../middlewares/authMiddleware");
const authorization  = require("../middlewares/authorization");

// Public
router.get("/getAllUpdates", getAllUpdates);
router.get("/getUpdateById/:id", getUpdateById);

// Admin only
router.post("/addUpdate", authentication, authorization("admin"), upload.fields([{ name: "pdf", maxCount: 1 }]), addUpdate);
router.put("/updateUpdate/:id", authentication, authorization("admin"), upload.fields([{ name: "pdf", maxCount: 1 }]), updateUpdate);
router.delete("/deleteUpdate/:id", authentication, authorization("admin"), deleteUpdate);

module.exports = router;

