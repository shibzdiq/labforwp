import express from 'express';
import { upload } from '../middleware/upload.js';
import { authenticate } from '../middleware/auth.js';
import { authorize } from '../middleware/authorize.js';
import fileController from '../controllers/fileController.js';
import { uploadMultiple } from '../middleware/upload.js';
import { uploadFiles } from '../controllers/fileController.js';

const router = express.Router();

// POST /files - upload a file (authenticated)
router.post('/', authenticate, upload.single('file'), fileController.uploadFile);

// GET /files/:id - download a file (authenticated)
router.get('/:id', authenticate, fileController.getFile);

// DELETE /files/:id - delete a file (authenticated). Handler enforces uploader or ADMIN.
router.delete('/:id', authenticate, fileController.deleteFile);

// PUT /files/:id - replace existing file (authenticated)
/**
 * @swagger
 * /api/files/{id}:
 *   put:
 *     summary: Replace an existing uploaded file
 *     tags: [Files]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: File ID to replace
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: File replaced successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: Forbidden (not uploader or admin)
 */
router.put('/:id', authenticate, upload.single('file'), fileController.updateFile);

// POST /files/multi - upload multiple files (authenticated)
/**
 * @swagger
 * /api/files/multi:
 *   post:
 *     summary: Upload multiple files
 *     tags: [Files]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               files:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       201:
 *         description: Files uploaded
 *       400:
 *         description: No files uploaded
 */
router.post('/multi', authenticate, uploadMultiple, uploadFiles);

export default router;
