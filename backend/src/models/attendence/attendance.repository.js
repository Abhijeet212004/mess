import prisma from "../config/db.js";

const attendanceRepository = {
  async markAttendance(userId, date, type) {
    return await prisma.attendance.create({
      data: {
        userId,
        date: new Date(date),
        type,
      },
    });
  },

  async getAttendanceByUserAndDate(userId, date, type) {
    return await prisma.attendance.findFirst({
      where: {
        userId,
        date: {
          gte: new Date(date + "T00:00:00.000Z"),
          lt: new Date(date + "T23:59:59.999Z"),
        },
        type,
      },
    });
  },

  async getMonthlyAttendance(userId, year, month) {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);

    return await prisma.attendance.findMany({
      where: {
        userId,
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: {
        date: 'asc',
      },
    });
  },

  async getAllUsersMonthlyAttendance(year, month) {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);

    return await prisma.attendance.findMany({
      where: {
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        date: 'asc',
      },
    });
  },
};

export default attendanceRepository;