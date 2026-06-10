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
const ratingRoutes = require("./routes/ratingRoute")
const cors = require("cors");



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
app.use("/enrollment",enrollmentRoutes);
app.use("/rating",ratingRoutes);

app.get("/",(req, res)=>{
    res.status(200).send({msg:"server is working fine, Don't worry!"});
});

// Connect DB
connectDB();

app.listen(process.env.PORT, () => {
  console.log(`Server is Running at Port ${process.env.PORT}`);
});