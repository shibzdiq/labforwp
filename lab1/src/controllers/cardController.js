import * as cardModel from '../models/cardModel.js';

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
    const cards = await cardModel.getAllCards();
    res.json(cards);
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
