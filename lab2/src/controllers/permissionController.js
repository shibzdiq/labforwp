import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const assignPermission = async (req, res) => {
  if (req.user?.role !== 'ADMIN') return res.status(403).json({ error: 'Forbidden' });
  const { userId, permissionName } = req.body;
  if (!userId || !permissionName) return res.status(400).json({ error: 'userId and permissionName required' });
  let perm = await prisma.permission.findUnique({ where: { name: permissionName } });
  if (!perm) perm = await prisma.permission.create({ data: { name: permissionName } });
  await prisma.userPermission.create({ data: { userId, permissionId: perm.id } });
  res.json({ message: 'Permission assigned' });
};

export const revokePermission = async (req, res) => {
  if (req.user?.role !== 'ADMIN') return res.status(403).json({ error: 'Forbidden' });
  const { userId, permissionName } = req.body;
  if (!userId || !permissionName) return res.status(400).json({ error: 'userId and permissionName required' });
  const perm = await prisma.permission.findUnique({ where: { name: permissionName } });
  if (!perm) return res.status(404).json({ error: 'Permission not found' });
  await prisma.userPermission.deleteMany({ where: { userId, permissionId: perm.id } });
  res.json({ message: 'Permission revoked' });
};
