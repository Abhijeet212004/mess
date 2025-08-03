import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import AuthRouter from "./models/auth/auth.route.js";
import AttendanceRouter from "./models/attendence/attendance.route.js";

dotenv.config();

const app = express();

app.use(cors({
  origin: [
    process.env.FRONTEND_URL || 'http://localhost:3003',
    'https://mess-murex.vercel.app',
    'https://mess-murex.vercel.app/'
  ],
  credentials: true
}));
app.use(express.json());

app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
});

app.get("/test", (req, res) => {
    res.json({ message: "Server is working" });
});

app.use("/auth", AuthRouter);
app.use("/attendance", AttendanceRouter);

export default app;
