import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export function audit(action, resource = null, resourceId = null) {
  return async (req, res, next) => {
    try {
      await prisma.audit.create({
        data: {
          userId: req.user?.userId || null,
          action,
          resource,
          resourceId,
          ip: req.ip,
          userAgent: req.headers['user-agent'] || null
        }
      });
    } catch (err) {
      // Silent fail for logging
    }
    next();
  };
}
