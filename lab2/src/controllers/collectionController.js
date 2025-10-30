import * as CollectionModel from '../models/collectionModel.js';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createCollection = async (req, res, next) => {
    try {
        const collection = await CollectionModel.createCollection(req.body);
        res.status(201).json(collection);
    } catch (error) {
        next(error);
    }
};

export const getAllCollections = async (req, res, next) => {
    try {
        const page = Math.max(1, parseInt(req.query.page) || 1);
        const limit = Math.min(100, parseInt(req.query.limit) || 10);
        const search = req.query.search || req.query.q || '';
        const skip = (page - 1) * limit;

        const where = {};
        if (search) {
            where.name = { contains: search, mode: 'insensitive' };
        }

        const [data, total] = await Promise.all([
            prisma.collection.findMany({ where, skip, take: limit, orderBy: { createdAt: 'desc' } }),
            prisma.collection.count({ where })
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
    } catch (error) {
        next(error);
    }
};

export const getCollectionById = async (req, res, next) => {
    try {
        const collection = await CollectionModel.getCollectionById(req.params.id);
        if (!collection) {
            return res.status(404).json({ error: 'Collection not found' });
        }
        res.json(collection);
    } catch (error) {
        next(error);
    }
};

export const updateCollection = async (req, res, next) => {
    try {
        const collection = await CollectionModel.updateCollection(req.params.id, req.body);
        res.json(collection);
    } catch (error) {
        next(error);
    }
};

export const deleteCollection = async (req, res, next) => {
    try {
        await CollectionModel.deleteCollection(req.params.id);
        res.status(204).send();
    } catch (error) {
        next(error);
    }
};

export const addCardToCollection = async (req, res, next) => {
    try {
        const collection = await CollectionModel.addCardToCollection(req.params.id, req.body.cardId);
        res.json(collection);
    } catch (error) {
        next(error);
    }
};

export const removeCardFromCollection = async (req, res, next) => {
    try {
        const collection = await CollectionModel.removeCardFromCollection(req.params.id, req.body.cardId);
        res.json(collection);
    } catch (error) {
        next(error);
    }
};