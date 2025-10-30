import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createCard = async (data) => {
	return await prisma.card.create({ data });
};

export const getCardById = async (id) => {
	return await prisma.card.findUnique({ where: { id } });
};

export const getAllCards = async () => {
	return await prisma.card.findMany();
};

export const updateCard = async (id, data) => {
	return await prisma.card.update({ where: { id }, data });
};

export const deleteCard = async (id) => {
	return await prisma.card.delete({ where: { id } });
};
