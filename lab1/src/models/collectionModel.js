import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const createCollection = async (data) => {
    return prisma.collection.create({
        data: {
            name: data.name,
            description: data.description,
            isPublic: data.isPublic ?? true,
            userId: data.userId,
        },
        include: {
            user: true,
            cards: true,
        }
    });
};

export const getAllCollections = async () => {
    return prisma.collection.findMany({
        include: {
            user: true,
            cards: true,
        }
    });
};

export const getCollectionById = async (id) => {
    return prisma.collection.findUnique({
        where: { id: Number(id) },
        include: {
            user: true,
            cards: true,
        }
    });
};

export const updateCollection = async (id, data) => {
    return prisma.collection.update({
        where: { id: Number(id) },
        data: {
            name: data.name,
            description: data.description,
            isPublic: data.isPublic,
        },
        include: {
            user: true,
            cards: true,
        }
    });
};

export const deleteCollection = async (id) => {
    return prisma.collection.delete({
        where: { id: Number(id) }
    });
};

export const addCardToCollection = async (collectionId, cardId) => {
    return prisma.collection.update({
        where: { id: Number(collectionId) },
        data: {
            cards: {
                connect: { id: Number(cardId) }
            }
        },
        include: {
            cards: true
        }
    });
};

export const removeCardFromCollection = async (collectionId, cardId) => {
    return prisma.collection.update({
        where: { id: Number(collectionId) },
        data: {
            cards: {
                disconnect: { id: Number(cardId) }
            }
        },
        include: {
            cards: true
        }
    });
};