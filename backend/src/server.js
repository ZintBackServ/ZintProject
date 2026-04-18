const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const app = express();
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoute")
const mentorRoutes = require("./routes/mentorRoute")
const courseRoutes = require("./routes/courseRoute")
const enrollmentRoutes = require("./routes/enrollmentRoute")
const cors = require("cors");



//let's tackle cors
const corsOptions = {
    origin:"http://localhost:5174",
    methods:"GET, POST, PUT, DELETE,PATCH, HEAD",
    credentials:true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/",userRoutes);
app.use("/",courseRoutes);
app.use("/",mentorRoutes);
app.use("/",enrollmentRoutes);

app.get("/",(req, res)=>{
    res.status(200).send({msg:"server is created"});
});

// Connect DB
connectDB();

app.listen(process.env.PORT, () => {
  console.log(`Server is Running at Port ${process.env.PORT}`);
});