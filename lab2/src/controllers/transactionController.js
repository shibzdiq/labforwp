import * as transactionModel from '../models/transactionModel.js';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const validateTransaction = (data) => {
  if (!data || typeof data !== 'object') throw new Error('Request body is required');
  if (data.buyerId === undefined || typeof data.buyerId !== 'number') throw new Error('Invalid buyerId');
  if (data.sellerId === undefined || typeof data.sellerId !== 'number') throw new Error('Invalid sellerId');
  if (data.cardId === undefined || typeof data.cardId !== 'number') throw new Error('Invalid cardId');
  if (data.price === undefined || typeof data.price !== 'number') throw new Error('Invalid price');
};

export const createTransaction = async (req, res) => {
  try {
    validateTransaction(req.body);
    const transaction = await transactionModel.createTransaction(req.body);
    res.status(201).json(transaction);
  } catch (err) {
    if (err && err.code === 'P2003') {
      return res.status(400).json({ error: err.message || 'Foreign key constraint violated' });
    }
    res.status(400).json({ error: err.message });
  }
};

export const getAllTransactions = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, parseInt(req.query.limit) || 10);
    const skip = (page - 1) * limit;
    const { buyerId, sellerId, cardId } = req.query;

    const where = {};
    if (buyerId) where.buyerId = Number(buyerId);
    if (sellerId) where.sellerId = Number(sellerId);
    if (cardId) where.cardId = Number(cardId);

    const [data, total] = await Promise.all([
      prisma.transaction.findMany({ where, skip, take: limit, include: { buyer: true, seller: true, card: true }, orderBy: { createdAt: 'desc' } }),
      prisma.transaction.count({ where })
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

export const getTransactionById = async (req, res) => {
  try {
    const transaction = await transactionModel.getTransactionById(Number(req.params.id));
    if (!transaction) return res.status(404).json({ error: 'Transaction not found' });
    res.json(transaction);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateTransaction = async (req, res) => {
  try {
    validateTransaction(req.body);
    const updatedTransaction = await transactionModel.updateTransaction(Number(req.params.id), req.body);
    res.json(updatedTransaction);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const deleteTransaction = async (req, res) => {
  try {
    await transactionModel.deleteTransaction(Number(req.params.id));
    res.json({ message: 'Transaction deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
