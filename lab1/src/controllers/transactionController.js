import * as transactionModel from '../models/transactionModel.js';

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
    const transactions = await transactionModel.getAllTransactions();
    res.json(transactions);
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
