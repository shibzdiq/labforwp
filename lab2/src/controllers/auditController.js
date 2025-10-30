import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const getAuditLogs = async (req, res) => {
  if (req.user?.role !== 'ADMIN') return res.status(403).json({ error: 'Forbidden' });
  const logs = await prisma.audit.findMany({
    orderBy: { timestamp: 'desc' },
    take: 100
  });
  res.json({ logs });
};
