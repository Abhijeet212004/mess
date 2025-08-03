import prisma from '../config/db.js';

const findUserByEmail = (email) => {
  return prisma.user.findUnique({ where: { email } });
};

const createUser = (data) => {
  return prisma.user.create({ data });
};

const findUserById = (id) => {
  return prisma.user.findUnique({ where: { id } });
};

export default {
  findUserByEmail,
  createUser,
  findUserById,
};
