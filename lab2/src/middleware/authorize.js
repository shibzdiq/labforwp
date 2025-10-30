import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

/**
 * Authorization middleware
 * Checks if the user has the required role
 * @param {...string} allowedRoles - Roles that are allowed to access the route
 */
export function authorize(...allowedRoles) {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                error: 'Authentication required'
            });
        }

        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                error: 'Insufficient permissions'
            });
        }

        next();
    };
}

export function requirePermission(permissionName) {
  return async (req, res, next) => {
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ error: 'Not authenticated' });
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { userPermissions: { include: { permission: true } } }
    });
    if (!user) return res.status(404).json({ error: 'User not found' });
    const hasPerm = user.userPermissions.some(up => up.permission.name === permissionName);
    if (!hasPerm) return res.status(403).json({ error: 'Forbidden: missing permission' });
    next();
  };
}
