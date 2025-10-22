import * as CollectionModel from '../models/collectionModel.js';

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
        const collections = await CollectionModel.getAllCollections();
        res.json(collections);
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