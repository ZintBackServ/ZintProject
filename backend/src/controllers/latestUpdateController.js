const mongoose   = require("mongoose");
const latestUpdateModel = require("../models/latestUpdateModel");
const { uploadOnCloudinary } = require("../utils/cloudinary");

// POST /addUpdate  
const addUpdate = async (req, res) => {
  try {
    const { heading } = req.body;

    if (!heading || !heading.trim())
      return res.status(400).json({ msg: "Heading is required" });

    if (!req.files || !req.files.pdf)
      return res.status(400).json({ msg: "PDF file is required" });

    const pdfLocalPath = req.files.pdf[0].path;
    const uploadedPdf  = await uploadOnCloudinary(pdfLocalPath,"raw");

    if (!uploadedPdf)
      return res.status(400).json({ msg: "PDF upload failed" });

    const update = await latestUpdateModel.create({
      heading: heading.trim(),
      pdf: uploadedPdf.secure_url || uploadedPdf.url,
    });

    return res.status(201).json({ msg: "Update created successfully", data: update });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Internal Server Error", error: error.message });
  }
};

// GET /getAllUpdates
const getAllUpdates = async (req, res) => {
  try {
    const updates = await latestUpdateModel.find().sort({ createdAt: -1 });
    return res.status(200).json({ msg: "Updates fetched successfully", data: updates });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

// GET /getUpdateById/:id 
const getUpdateById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ msg: "Invalid Id" });

    const update = await latestUpdateModel.findById(id);
    if (!update)
      return res.status(404).json({ msg: "Update not found" });

    return res.status(200).json({ msg: "Update fetched successfully", data: update });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

// PUT /updateUpdate/:id 
const updateUpdate = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ msg: "Invalid Id" });

    const updateData = {};
    if (req.body.heading) updateData.heading = req.body.heading.trim();

    if (req.files?.pdf) {
      const pdf = await uploadOnCloudinary(req.files.pdf[0].path,"raw");
      if (!pdf) return res.status(400).json({ msg: "PDF upload failed" });
      updateData.pdf = pdf.secure_url || pdf.url;
    }

    const updated = await latestUpdateModel.findByIdAndUpdate(id, updateData, { new: true });
    if (!updated)
      return res.status(404).json({ msg: "Update not found" });

    return res.status(200).json({ msg: "Update updated successfully", data: updated });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

// DELETE /deleteUpdate/:id
const deleteUpdate = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ msg: "Invalid Id" });

    const deleted = await latestUpdateModel.findByIdAndDelete(id);
    if (!deleted)
      return res.status(404).json({ msg: "Update not found" });

    return res.status(200).json({ msg: "Update deleted successfully", data: deleted });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

module.exports = { addUpdate, getAllUpdates, getUpdateById, updateUpdate, deleteUpdate };