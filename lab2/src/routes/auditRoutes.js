import express from 'express';
import { authenticate } from '../middleware/auth.js';
import { getAuditLogs } from '../controllers/auditController.js';

const router = express.Router();

/**
 * @swagger
 * /api/audit:
 *   get:
 *     summary: Get audit logs (admin only)
 *     tags: [Audit]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of audit logs
 *       403:
 *         description: Forbidden
 */
router.get('/', authenticate, getAuditLogs);

export default router;
