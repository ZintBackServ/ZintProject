const dotenv = require("dotenv");
dotenv.config();
const express        = require("express");
const app            = express();

// Hostinger/Nginx terminates the public request and forwards it to this
// process. Trust exactly one proxy hop so rate limiting uses the real client
// IP from X-Forwarded-For instead of treating every visitor as the proxy.
app.set("trust proxy", 1);
const cookieParser   = require("cookie-parser");
const mongoSanitize  = require("express-mongo-sanitize");
const helmet         = require("helmet");
const connectDB      = require("./config/db");
const passport       = require("./config/passport");
const errorHandler   = require("./middlewares/errorHandler");
const csrfProtection = require("./middlewares/csrfProtection");
const fs             = require("fs");
const path           = require("path");

// ── Route imports ─────────────────────────────────────────────────────────────
const userRoutes                    = require("./routes/userRoute");
const mentorRoutes                  = require("./routes/mentorRoute");
const placedStudentRoutes           = require("./routes/placedStudent");
const courseRoutes                  = require("./routes/courseRoute");
const eventRoutes                   = require("./routes/eventRoute");
const eventRegistrationRoutes       = require("./routes/eventRegistrationRoute");
const enrollmentRoutes              = require("./routes/enrollmentRoute");
const paymentRoutes                 = require("./routes/paymentRoute");
const ratingRoutes                  = require("./routes/ratingRoute");
const categoryRoutes                = require("./routes/categoryRoute");
const notificationRoutes            = require("./routes/notificationRoute");
const latestUpdateRoutes            = require("./routes/latestUpdateRoute");
const enquiryRoutes                 = require("./routes/enquiryRoute");
const timeTableRoutes               = require("./routes/timeTableRoute");
const internshipRegistrationRoutes  = require("./routes/internshipRegistrationRoute");
const placementRegistrationRoutes   = require("./routes/placementRegistrationRoute");
const admissionRoutes               = require("./routes/admissionRoute");
const trainingRegistrationRoutes    = require("./routes/trainingRegistrationRoute");
const webinarRoutes                 = require("./routes/webinarRoute");
const jobUpdateRoutes               = require("./routes/jobUpdateRoute");
const studentDetailRoutes           = require("./routes/studentDetailRoute");

const { initWhatsApp }              = require("./services/whatsappService");
const { initCronJobs }              = require("./services/cronService");

const cors           = require("cors");

// ── HTTP Security Headers (Helmet) ───────────────────────────────────────────
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'none'"],
        baseUri: ["'none'"],
        frameAncestors: ["'none'"],
        formAction: ["'self'"],
      },
    },
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

// ── Webhook: MUST come before body parsers ────────────────────────────────────
app.use("/api/payments/webhook", express.raw({ type: "application/json" }));

// ── CORS ──────────────────────────────────────────────────────────────────────
const corsOptions = {
  origin:      [process.env.FRONTEND_URL, process.env.frontendurl, process.env.frontendurl2]
    .filter(Boolean)
    .map((url) => String(url).trim().replace(/^["']|["']$/g, "").replace(/\/+$/, "")),
  methods:     "GET, POST, PUT, DELETE, PATCH, HEAD",
  credentials: true,   // required for cookies
};
app.use(cors(corsOptions));

// ── Body Parsers ──────────────────────────────────────────────────────────────
// Limit raised to 50 MB — course/event forms include large text fields (syllabus,
// curriculum JSON, base64 previews) that can easily exceed the default 100 KB cap.
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true, limit: "2mb" }));

// ── Cookie Parser ─────────────────────────────────────────────────────────────
app.use(cookieParser());
app.use(csrfProtection);

// Uploaded files are temporary only. Remove any file a controller did not
// upload/delete so malformed requests cannot fill the server disk over time.
const tempUploadDir = path.resolve(__dirname, "../public/temp");
app.use((req, res, next) => {
  res.on("finish", () => {
    const files = [
      ...(req.file ? [req.file] : []),
      ...Object.values(req.files || {}).flat(),
    ];
    for (const file of files) {
      if (!file?.path) continue;
      const filePath = path.resolve(file.path);
      if (filePath.startsWith(`${tempUploadDir}${path.sep}`)) {
        fs.promises.unlink(filePath).catch(() => {});
      }
    }
  });
  next();
});

// ── Pre-register Mongoose Models ──────────────────────────────────────────────
require("./models/userModel");
require("./models/categoryModel");
require("./models/courseModel");
require("./models/mentorModel");
require("./models/placedStudentModel");
require("./models/eventModel");
require("./models/eventRegistrationModel");
require("./models/enrollmentModel");
require("./models/ratingModel");
require("./models/notificationModel");
require("./models/latestUpdateModel");
require("./models/enquiryModel");
require("./models/timeTableModel");
require("./models/internshipRegistrationModel");
require("./models/placementRegistrationModel");
require("./models/AdmissionModel");
require("./models/trainingRegistrationModel");
require("./models/webinarModel");
require("./models/webinarRegistrationModel");
require("./models/jobUpdateModel");
require("./models/jobInterestModel");

// ── NoSQL Injection Sanitization ──────────────────────────────────────────────
// Express 5 compatible sanitization (sanitizes req.body and req.params without mutating read-only req.query getter)
app.use((req, res, next) => {
  if (req.body) mongoSanitize.sanitize(req.body);
  if (req.params) mongoSanitize.sanitize(req.params);
  next();
});

// ── Passport (Google OAuth — stateless JWT) ───────────────────────────────────
app.use(passport.initialize());

// ── Routes ────────────────────────────────────────────────────────────────────
app.use("/user",                    userRoutes);
app.use("/course",                  courseRoutes);
app.use("/mentor",                  mentorRoutes);
app.use("/placedStudent",           placedStudentRoutes);
app.use("/event",                   eventRoutes);
app.use("/eventRegistration",       eventRegistrationRoutes);
app.use("/api/enrollments",         enrollmentRoutes);
app.use("/api/payments",            paymentRoutes);
app.use("/rating",                  ratingRoutes);
app.use("/notification",            notificationRoutes);
app.use("/category",                categoryRoutes);
app.use("/updates",                 latestUpdateRoutes);
app.use("/enquiry",                 enquiryRoutes);
app.use("/timeTable",               timeTableRoutes);
app.use("/internshipRegistration",  internshipRegistrationRoutes);
app.use("/placementRegistration",   placementRegistrationRoutes);
app.use("/admission",               admissionRoutes);
app.use("/trainingRegistration",    trainingRegistrationRoutes);
app.use("/webinar",                 webinarRoutes);
app.use("/job-updates",             jobUpdateRoutes);
app.use("/student-detail",          studentDetailRoutes);

// ── Health check ──────────────────────────────────────────────────────────────
app.get("/",          (req, res) => res.status(200).json({ msg: "Server is working fine!" }));
app.get("/api/health",(_, res)   => res.json({ status: "ok" }));

// ── Multer / file-upload error handler ───────────────────────────────────────
// Must sit before the generic errorHandler so multer errors get a clean 413/400
// JSON response instead of falling through to a 500 or unhandled rejection.
app.use((err, req, res, next) => {
  if (err.code === "LIMIT_FILE_SIZE") {
    return res.status(413).json({ success: false, message: "File too large. Maximum allowed size exceeded." });
  }
  if (err.code === "LIMIT_UNEXPECTED_FILE") {
    return res.status(400).json({ success: false, message: `Unexpected file field: "${err.field}".` });
  }
  if (err.code === "LIMIT_FILE_COUNT") {
    return res.status(400).json({ success: false, message: "Too many files uploaded." });
  }
  next(err); // pass non-multer errors to the generic handler
});

// ── 404 ───────────────────────────────────────────────────────────────────────
app.use((_, res) => res.status(404).json({ success: false, message: "Route not found." }));

// ── Global Error Handler (must be last) ───────────────────────────────────────
app.use(errorHandler);

// ── Connect DB & Start ────────────────────────────────────────────────────────
connectDB().then(() => {
  const userModel = require("./models/userModel");
  userModel.syncIndexes().catch(err => console.log("User index sync info:", err.message));
});

app.listen(process.env.PORT, () => {
  console.log(`Server is Running at Port ${process.env.PORT}`);
  // Initialize WhatsApp client and reminder scheduler
  initWhatsApp();
  initCronJobs();
});
