const multer = require("multer");
const path   = require("path");
const fs     = require("fs");

const TEMP_DIR = path.resolve(__dirname, "../../public/temp");
fs.mkdirSync(TEMP_DIR, { recursive: true });

const PDF_FIELDS = new Set(["courseCurriculum", "pdf"]);
const IMAGE_MIME_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
const PDF_MIME_TYPES = new Set(["application/pdf"]);
const IMAGE_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp"]);
const PDF_EXTENSIONS = new Set([".pdf"]);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, TEMP_DIR);
  },
  filename: function (req, file, cb) {
    // Unique filename: timestamp + random suffix + original extension
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix + ext);
  },
});

// File size limits per field type:
//   Images  → 10 MB  (course thumbnails, certificates, mentor photos, etc.)
//   PDFs    → 20 MB  (curriculum documents)
// The multer LIMIT_FILE_SIZE error is caught in server.js and returned as a
// clean 413 JSON response rather than an unhandled crash.
const FILE_SIZE_LIMIT = 20 * 1024 * 1024; // 20 MB covers both images and PDFs

const upload = multer({
  storage,
  limits: { fileSize: FILE_SIZE_LIMIT, files: 3 },
  fileFilter: (req, file, cb) => {
    const isPdfField = PDF_FIELDS.has(file.fieldname);
    const allowedTypes = isPdfField ? PDF_MIME_TYPES : IMAGE_MIME_TYPES;
    const allowedExtensions = isPdfField ? PDF_EXTENSIONS : IMAGE_EXTENSIONS;
    const extension = path.extname(file.originalname).toLowerCase();

    if (!allowedTypes.has(file.mimetype) || !allowedExtensions.has(extension)) {
      return cb(new multer.MulterError("LIMIT_UNEXPECTED_FILE", file.fieldname));
    }
    cb(null, true);
  },
});

module.exports = upload;
