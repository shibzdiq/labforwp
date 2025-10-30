import * as userModel from '../models/userModel.js';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createUserController = async (req, res) => {
  try {
    const { email, username, password } = req.body;

    if (!email || !username || !password) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const newUser = await userModel.createUser({ email, username, password });
    res.status(201).json(newUser);
  } catch (error) {
    if (error && error.code === 'P2002') {
      const target = error.meta && Array.isArray(error.meta.target) ? error.meta.target.join(', ') : 'unique field';
      return res.status(409).json({ error: `Unique constraint failed on: ${target}` });
    }
    res.status(500).json({ error: error.message });
  }
};

export const getUsersController = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, parseInt(req.query.limit) || 10);
    const search = req.query.search || req.query.q || '';
    const skip = (page - 1) * limit;

    const where = {};
    if (search) {
      where.OR = [
        { username: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } }
      ];
    }

    const [data, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: { id: true, username: true, email: true, role: true, createdAt: true },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.user.count({ where })
    ]);

    res.status(200).json({
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasMore: skip + data.length < total
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createUser = createUserController;
export const getAllUsers = getUsersController;

export const getUserById = async (req, res) => {
  try {
    const user = await userModel.getUserById(Number(req.params.id));
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { name, email, username } = req.body;
    
    if (Object.keys(req.body).length === 0) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const updated = await userModel.updateUser(Number(req.params.id), req.body);
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    await userModel.deleteUser(Number(req.params.id));
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
