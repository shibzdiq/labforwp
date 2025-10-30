import * as cardModel from '../models/cardModel.js';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const validateCard = (data) => {
  if (!data.name || typeof data.name !== 'string') throw new Error('Invalid card name');
  if (!data.rarity || typeof data.rarity !== 'string') throw new Error('Invalid rarity');
};

export const createCard = async (req, res) => {
  try {
    validateCard(req.body);
    const card = await cardModel.createCard(req.body);
    res.status(201).json(card);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const getAllCards = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, parseInt(req.query.limit) || 10);
    const search = req.query.search || req.query.q || '';
    const skip = (page - 1) * limit;

    const where = {};
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ];
    }

    const [data, total] = await Promise.all([
      prisma.card.findMany({ where, skip, take: limit, orderBy: { createdAt: 'desc' } }),
      prisma.card.count({ where })
    ]);

    res.json({
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasMore: skip + data.length < total
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getCardById = async (req, res) => {
  try {
    const card = await cardModel.getCardById(Number(req.params.id));
    if (!card) return res.status(404).json({ error: 'Card not found' });
    res.json(card);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateCard = async (req, res) => {
  try {
    validateCard(req.body);
    const updatedCard = await cardModel.updateCard(Number(req.params.id), req.body);
    res.json(updatedCard);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const deleteCard = async (req, res) => {
  try {
    await cardModel.deleteCard(Number(req.params.id));
    res.json({ message: 'Card deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
