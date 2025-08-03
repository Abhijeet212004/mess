import { z } from "zod";

export const markAttendanceSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format"),
  type: z.enum(["MORNING", "NIGHT"], "Type must be either MORNING or NIGHT"),
});

export const monthlyAttendanceSchema = z.object({
  year: z.number().int().min(2020).max(2030),
  month: z.number().int().min(1).max(12),
});