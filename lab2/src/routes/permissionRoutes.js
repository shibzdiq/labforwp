import express from 'express';
import { authenticate } from '../middleware/auth.js';
import { assignPermission, revokePermission } from '../controllers/permissionController.js';

const router = express.Router();

/**
 * @swagger
 * /api/permissions/assign:
 *   post:
 *     summary: Assign permission to user (admin only)
 *     tags: [Permissions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - permissionName
 *             properties:
 *               userId:
 *                 type: integer
 *               permissionName:
 *                 type: string
 *     responses:
 *       200:
 *         description: Permission assigned
 *       403:
 *         description: Forbidden
 */
router.post('/assign', authenticate, assignPermission);

/**
 * @swagger
 * /api/permissions/revoke:
 *   post:
 *     summary: Revoke permission from user (admin only)
 *     tags: [Permissions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - permissionName
 *             properties:
 *               userId:
 *                 type: integer
 *               permissionName:
 *                 type: string
 *     responses:
 *       200:
 *         description: Permission revoked
 *       403:
 *         description: Forbidden
 */
router.post('/revoke', authenticate, revokePermission);

export default router;
