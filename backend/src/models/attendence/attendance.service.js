import attendanceRepository from "./attendance.repository.js";

export const markAttendanceService = async (userId, date, type) => {
  try {
    // Check if attendance already marked for this date and type
    const existingAttendance = await attendanceRepository.getAttendanceByUserAndDate(
      userId,
      date,
      type
    );

    if (existingAttendance) {
      throw new Error(`Attendance already marked for ${type.toLowerCase()} on ${date}`);
    }

    const attendance = await attendanceRepository.markAttendance(userId, date, type);
    return attendance;
  } catch (error) {
    throw new Error(error.message || "Error marking attendance");
  }
};

export const getMonthlyAttendanceService = async (userId, year, month) => {
  try {
    const attendance = await attendanceRepository.getMonthlyAttendance(userId, year, month);
    return attendance;
  } catch (error) {
    throw new Error(error.message || "Error fetching monthly attendance");
  }
};

export const calculateMonthlyCostService = async (year, month) => {
  try {
    const MESS_PRICE = 3360;
    const COST_PER_ENTRY = 60;
    
    const allAttendance = await attendanceRepository.getAllUsersMonthlyAttendance(year, month);
    
    // Group attendance by user
    const userAttendance = {};
    allAttendance.forEach(attendance => {
      const userId = attendance.userId;
      if (!userAttendance[userId]) {
        userAttendance[userId] = {
          user: attendance.user,
          count: 0,
          entries: []
        };
      }
      userAttendance[userId].count++;
      userAttendance[userId].entries.push({
        date: attendance.date,
        type: attendance.type
      });
    });

    // Calculate cost for each user
    const userCosts = Object.values(userAttendance).map(userData => ({
      user: userData.user,
      entries: userData.count,
      cost: userData.count * COST_PER_ENTRY,
      attendanceDetails: userData.entries
    }));

    const totalEntries = allAttendance.length;

    return {
      totalMessPrice: MESS_PRICE,
      totalEntries,
      costPerEntry: COST_PER_ENTRY,
      userCosts,
      month,
      year
    };
  } catch (error) {
    throw new Error(error.message || "Error calculating monthly cost");
  }
};