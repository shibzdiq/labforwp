import express from 'express';
import * as CollectionController from '../controllers/collectionController.js';

const router = express.Router();

// Основні CRUD операції
router.post('/', CollectionController.createCollection);
router.get('/', CollectionController.getAllCollections);
router.get('/:id', CollectionController.getCollectionById);
router.put('/:id', CollectionController.updateCollection);
router.delete('/:id', CollectionController.deleteCollection);

// Додаткові операції для управління картками в колекції
router.post('/:id/cards', CollectionController.addCardToCollection);
router.delete('/:id/cards', CollectionController.removeCardFromCollection);

export default router;