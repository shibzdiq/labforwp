import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const createTransaction = async (data) => {
  const { buyerId, sellerId, cardId } = data;
  const [buyer, seller, card] = await Promise.all([
    prisma.user.findUnique({ where: { id: buyerId } }),
    prisma.user.findUnique({ where: { id: sellerId } }),
    prisma.card.findUnique({ where: { id: cardId } }),
  ]);

  if (!buyer) throw Object.assign(new Error('Buyer not found'), { code: 'P2003' });
  if (!seller) throw Object.assign(new Error('Seller not found'), { code: 'P2003' });
  if (!card) throw Object.assign(new Error('Card not found'), { code: 'P2003' });

  return await prisma.transaction.create({ data });
};

export const getTransactionById = async (id) => {
  return await prisma.transaction.findUnique({ where: { id } });
};

export const getAllTransactions = async () => {
  return await prisma.transaction.findMany({
    include: {
      buyer: true,
      seller: true,
      card: true,
    },
  });
};

export const updateTransaction = async (id, data) => {
  return await prisma.transaction.update({
    where: { id },
    data,
  });
};

export const deleteTransaction = async (id) => {
  return await prisma.transaction.delete({ where: { id } });
};
