import { markAttendanceService, getMonthlyAttendanceService, calculateMonthlyCostService } from "./attendance.service.js";
import { markAttendanceSchema, monthlyAttendanceSchema } from "./attendance.validation.js";

export const markAttendance = async (req, res) => {
  try {
    const validationResult = markAttendanceSchema.safeParse(req.body);
    if (!validationResult.success) {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: validationResult.error.errors,
      });
    }

    const { date, type } = req.body;
    const userId = req.user.id; 

    const attendance = await markAttendanceService(userId, date, type);

    res.status(201).json({
      success: true,
      message: "Attendance marked successfully",
      attendance,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const getMonthlyAttendance = async (req, res) => {
  try {
    const { year, month } = req.params;
    const validationResult = monthlyAttendanceSchema.safeParse({
      year: parseInt(year),
      month: parseInt(month),
    });

    if (!validationResult.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid year or month",
        errors: validationResult.error.errors,
      });
    }

    const userId = req.user.id;
    const attendance = await getMonthlyAttendanceService(userId, parseInt(year), parseInt(month));

    res.status(200).json({
      success: true,
      attendance,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getMonthlyCost = async (req, res) => {
  try {
    const { year, month } = req.params;
    const validationResult = monthlyAttendanceSchema.safeParse({
      year: parseInt(year),
      month: parseInt(month),
    });

    if (!validationResult.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid year or month",
        errors: validationResult.error.errors,
      });
    }

    const costData = await calculateMonthlyCostService(parseInt(year), parseInt(month));

    res.status(200).json({
      success: true,
      data: costData,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};