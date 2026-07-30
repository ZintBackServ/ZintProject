const dotenv = require("dotenv");
dotenv.config();
const express        = require("express");
const app            = express();
const cookieParser   = require("cookie-parser");
const mongoSanitize  = require("express-mongo-sanitize");
const cors           = require("cors");
const connectDB      = require("./config/db");
const passport       = require("./config/passport");
const errorHandler   = require("./middlewares/errorHandler");

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

// ── Webhook: MUST come before body parsers ────────────────────────────────────
app.use("/api/payments/webhook", express.raw({ type: "application/json" }));

// ── CORS ──────────────────────────────────────────────────────────────────────
const corsOptions = {
  origin:      [process.env.frontendurl, process.env.frontendurl2].filter(Boolean),
  methods:     "GET, POST, PUT, DELETE, PATCH, HEAD",
  credentials: true,   // required for cookies
};
app.use(cors(corsOptions));

// ── Body Parsers ──────────────────────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Cookie Parser ─────────────────────────────────────────────────────────────
app.use(cookieParser());

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

// ── Health check ──────────────────────────────────────────────────────────────
app.get("/",          (req, res) => res.status(200).json({ msg: "Server is working fine!" }));
app.get("/api/health",(_, res)   => res.json({ status: "ok" }));

// ── 404 ───────────────────────────────────────────────────────────────────────
app.use((_, res) => res.status(404).json({ success: false, message: "Route not found." }));

// ── Global Error Handler (must be last) ───────────────────────────────────────
app.use(errorHandler);

// ── Connect DB & Start ────────────────────────────────────────────────────────
connectDB();
app.listen(process.env.PORT, () => {
  console.log(`Server is Running at Port ${process.env.PORT}`);
});