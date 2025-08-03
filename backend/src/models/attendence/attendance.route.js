import express from "express";
import { markAttendance, getMonthlyAttendance, getMonthlyCost } from "./attendance.controller.js";
import { authenticateToken } from "../../middleware/auth.middleware.js";

const AttendanceRouter = express.Router();

// Mark attendance (requires authentication)
AttendanceRouter.post("/mark", authenticateToken, markAttendance);

// Get user's monthly attendance
AttendanceRouter.get("/monthly/:year/:month", authenticateToken, getMonthlyAttendance);

// Get monthly cost distribution for all users
AttendanceRouter.get("/cost/:year/:month", authenticateToken, getMonthlyCost);

export default AttendanceRouter;