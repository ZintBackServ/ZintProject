const express = require("express");
const router  = express.Router();
const { addUpdate, getAllUpdates, getUpdateById, updateUpdate, deleteUpdate } = require("../controllers/latestUpdateController");
const upload  = require("../middlewares/multerMiddleware");

router.post("/addUpdate", upload.fields([{ name: "pdf", maxCount: 1 }]), addUpdate);
router.get("/getAllUpdates", getAllUpdates);
router.get("/getUpdateById/:id", getUpdateById);
router.put("/updateUpdate/:id", upload.fields([{ name: "pdf", maxCount: 1 }]), updateUpdate);
router.delete("/deleteUpdate/:id", deleteUpdate);

module.exports = router;
