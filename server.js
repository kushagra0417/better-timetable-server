require("dotenv").config();

const mongoose = require("mongoose");
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");

// route imports
const authRoutes = require("./routes/auth");
const staffRoutes = require("./routes/staff");
const programRoutes = require("./routes/program");
const subjectRoutes = require("./routes/subject");
const noticeRoutes = require("./routes/notice");
const lectureRoutes = require("./routes/lecture");
const batchRoutes = require("./routes/batch");

// DB connection
const DB_NAME = 'better-timetable-test';
const DB_URL = `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_CLUSTER}/${DB_NAME}?retryWrites=true&w=majority`;


mongoose
    .connect(DB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log("DB CONNECTED");
    });

// middleware
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors({
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
    origin: ['http://localhost:3000', 'https://better-timetable.netlify.app']
}));

// routes
app.use("/auth/", authRoutes);
app.use("/staff/", staffRoutes);
app.use("/program/", programRoutes);
app.use("/subject/", subjectRoutes);
app.use("/notice/", noticeRoutes);
app.use("/batch/", batchRoutes);
app.use("/lecture/", lectureRoutes);

// port
const port = process.env.PORT || 8000;

// starting a server
app.listen(port, () => {
    console.log(`server is running at ${port}`);
});