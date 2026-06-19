const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const app = express();
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoute")
const mentorRoutes = require("./routes/mentorRoute")
const placedStudentRoutes = require("./routes/placedStudent")
const courseRoutes = require("./routes/courseRoute")
const eventRoutes = require("./routes/eventRoute")
const registrationRoutes = require("./routes/registrationRoute")
const enrollmentRoutes = require("./routes/enrollmentRoute")
const paymentRoutes  = require("./routes/paymentRoute");
const ratingRoutes = require("./routes/ratingRoute")
const notificationRoutes = require("./routes/notificationRoute")
const cors = require("cors");


// ── Webhook MUST be mounted before express.json() ────────────
app.use("/payments/webhook", express.raw({ type: "application/json" }));


//let's tackle cors
const corsOptions = {
    origin:[process.env.frontendurl,process.env.frontendurl2],
    methods:"GET, POST, PUT, DELETE,PATCH, HEAD",
    credentials:true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/user",userRoutes);
app.use("/course",courseRoutes);
app.use("/mentor",mentorRoutes);
app.use("/placedStudent",placedStudentRoutes);
app.use("/event",eventRoutes);
app.use("/registration",registrationRoutes);
app.use("/api/enrollments",enrollmentRoutes);
app.use("/api/payments",    paymentRoutes);
app.use("/rating",ratingRoutes);
app.use("/notification",notificationRoutes);

app.get("/",(req, res)=>{
    res.status(200).send({msg:"server is working fine, Don't worry!"});
});

// ── Health check ─────────────────────────────────────────────
app.get("/api/health", (_, res) => res.json({ status: "ok" }));

// ── 404 ───────────────────────────────────────────────────────
app.use((_, res) => res.status(404).json({ success: false, message: "Route not found." }));


// Connect DB
connectDB();

app.listen(process.env.PORT, () => {
  console.log(`Server is Running at Port ${process.env.PORT}`);
});


// require("dotenv").config();
// const express = require("express");
// const mongoose = require("mongoose");
// const cors = require("cors");

// const enrollmentRoutes = require("./routes/enrollmentRoutes");
// const paymentRoutes    = require("./routes/paymentRoutes");

// const app = express();

// // ── Webhook MUST be mounted before express.json() ────────────
// app.use("/api/payments/webhook", express.raw({ type: "application/json" }));

// // ── Global middleware ─────────────────────────────────────────
// app.use(cors({ origin: process.env.CLIENT_URL || "*" }));
// app.use(express.json());

// // ── Routes ───────────────────────────────────────────────────
// app.use("/api/enrollments", enrollmentRoutes);
// app.use("/api/payments",    paymentRoutes);

// // ── Health check ─────────────────────────────────────────────
// app.get("/api/health", (_, res) => res.json({ status: "ok" }));

// // ── 404 ───────────────────────────────────────────────────────
// app.use((_, res) => res.status(404).json({ success: false, message: "Route not found." }));

// // ── Connect DB & start ────────────────────────────────────────
// const PORT = process.env.PORT || 5000;
// mongoose
//   .connect(process.env.MONGO_URI)
//   .then(() => {
//     console.log("MongoDB connected");
//     app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
//   })
//   .catch((err) => {
//     console.error("DB connection failed:", err.message);
//     process.exit(1);
//   });