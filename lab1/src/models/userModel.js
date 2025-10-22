import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const SALT_ROUNDS = 10;

export const createUser = async ({ email, username, password }) => {
  // Basic pre-checks
  if (!email || !username || !password) throw new Error('email, username and password are required');

  const existing = await prisma.user.findFirst({
    where: {
      OR: [{ username }, { email }],
    },
  });
  if (existing) {
    if (existing.username === username) {
      const err = new Error('Username already exists');
      err.code = 'P2002';
      err.meta = { target: ['username'] };
      throw err;
    }
    if (existing.email === email) {
      const err = new Error('Email already exists');
      err.code = 'P2002';
      err.meta = { target: ['email'] };
      throw err;
    }
  }

  const hashed = await bcrypt.hash(password, SALT_ROUNDS);
  const user = await prisma.user.create({
    data: { email, username, password: hashed },
    select: { id: true, username: true, email: true, role: true, createdAt: true },
  });
  return user;
};

export const getUserById = async (id) => {
  return await prisma.user.findUnique({
    where: { id },
    select: { id: true, username: true, email: true, role: true, createdAt: true },
  });
};

export const getAllUsers = async () => {
  return await prisma.user.findMany({
    select: { id: true, username: true, email: true, role: true, createdAt: true },
  });
};

export const updateUser = async (id, data) => {
  const updateData = { ...data };
  if (updateData.password) {
    updateData.password = await bcrypt.hash(updateData.password, SALT_ROUNDS);
  }
  const updated = await prisma.user.update({
    where: { id },
    data: updateData,
    select: { id: true, username: true, email: true, role: true, createdAt: true },
  });
  return updated;
};

export const deleteUser = async (id) => {
  await prisma.user.delete({ where: { id } });
  return;
};
