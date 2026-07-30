const express = require("express");
const router  = express.Router();
const {
  addEnquiry,
  getAllEnquiries,
  getEnquiryById,
  markEnquiryContacted,
  deleteEnquiry,
} = require("../controllers/enquiryController");

router.post("/addEnquiry", addEnquiry);
router.get("/allEnquiries", getAllEnquiries);
router.get("/enquiryById/:id", getEnquiryById);
router.put("/markEnquiryContacted/:id", markEnquiryContacted);
router.delete("/deleteEnquiry/:id", deleteEnquiry);

module.exports = router;