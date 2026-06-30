const express = require("express");
const dotenv = require("dotenv");
dotenv.config();

const app = express();
const connectDB = require("./config/db");
const passport = require("./config/passport");   // ← Google OAuth setup

const userRoutes             = require("./routes/userRoute");
const mentorRoutes           = require("./routes/mentorRoute");
const placedStudentRoutes    = require("./routes/placedStudent");
const courseRoutes           = require("./routes/courseRoute");
const eventRoutes            = require("./routes/eventRoute");
const registrationRoutes     = require("./routes/registrationRoute");
const enrollmentRoutes       = require("./routes/enrollmentRoute");
const paymentRoutes          = require("./routes/paymentRoute");
const ratingRoutes           = require("./routes/ratingRoute");
const categoryRoutes           = require("./routes/categoryRoute");
const notificationRoutes     = require("./routes/notificationRoute");
const cors                   = require("cors");
const enrollmentModel        = require("./models/enrollmentModel");
// const enrollmentModel        = require("./models/enrollmentModel");


//  Webhook: MUST come before express.json() 
app.use("/payments/webhook", express.raw({ type: "application/json" }));

//  CORS 
const corsOptions = {
  origin: [process.env.frontendurl, process.env.frontendurl2],
  methods: "GET, POST, PUT, DELETE, PATCH, HEAD",
  credentials: true,
};
app.use(cors(corsOptions));

// ── Body Parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Passport (Google OAuth — no session needed, we use JWT) ──
app.use(passport.initialize());

//  Routes
app.use("/user",             userRoutes);          // includes /user/auth/google
app.use("/course",           courseRoutes);
app.use("/mentor",           mentorRoutes);
app.use("/placedStudent",    placedStudentRoutes);
app.use("/event",            eventRoutes);
app.use("/registration",     registrationRoutes);
app.use("/api/enrollments",  enrollmentRoutes);
app.use("/api/payments",     paymentRoutes);
app.use("/rating",           ratingRoutes);
app.use("/notification",     notificationRoutes);
app.use("/category",     categoryRoutes);



//  Health check
app.get("/", (req, res) => {
  res.status(200).send({ msg: "Server is working fine, Don't worry!" });
});

app.get("/api/health", (_, res) => res.json({ status: "ok" }));

//  Dev utility: delete all enrollments
app.get("/deleteEnrollments", async (req, res) => {
  try {
    let result = await enrollmentModel.deleteMany({});
    res.status(200).json({
      message: "Enrollments deleted successfully",
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    console.error("Error deleting enrollments:", error);
    res.status(500).json({ message: "Failed to delete enrollments", error: error.message });
  }
});

// 404 
app.use((_, res) => res.status(404).json({ success: false, message: "Route not found." }));

//  Connect DB & Start
connectDB();
app.listen(process.env.PORT, () => {
  console.log(`Server is Running at Port ${process.env.PORT}`);
});