import { PrismaClient } from '@prisma/client';
import fs from 'fs/promises';
import path from 'path';

const prisma = new PrismaClient();

export async function uploadFile(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'File not provided' });
    }

    const file = await prisma.file.create({
      data: {
        filename: req.file.filename,
        originalName: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size,
        path: req.file.path,
        uploadedBy: req.user?.userId || null
      }
    });

    res.status(201).json({ message: 'File uploaded', file });
  } catch (error) {
    console.error('Upload error', error);
    // remove file from disk if Prisma failed
    if (req.file && req.file.path) {
      await fs.unlink(req.file.path).catch(() => {});
    }
    res.status(500).json({ error: 'Server error while uploading file' });
  }
}

export async function getFile(req, res) {
  try {
    const id = Number(req.params.id);
    const file = await prisma.file.findUnique({ where: { id } });
    if (!file) return res.status(404).json({ error: 'File not found' });

    // send file
    return res.sendFile(path.resolve(file.path));
  } catch (error) {
    console.error('Get file error', error);
    res.status(500).json({ error: 'Server error while retrieving file' });
  }
}

export async function deleteFile(req, res) {
  try {
    const id = Number(req.params.id);
    const file = await prisma.file.findUnique({ where: { id } });
    if (!file) return res.status(404).json({ error: 'File not found' });

    // only uploader or ADMIN can delete
    const requesterId = req.user?.userId;
    const requesterRole = req.user?.role;
    if (file.uploadedBy !== requesterId && requesterRole !== 'ADMIN') {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }

    // delete from disk
    await fs.unlink(file.path).catch(() => {});

    await prisma.file.delete({ where: { id } });

    res.json({ message: 'File deleted' });
  } catch (error) {
    console.error('Delete file error', error);
    res.status(500).json({ error: 'Server error while deleting file' });
  }
}

export async function updateFile(req, res) {
  try {
    const id = Number(req.params.id);
    const existing = await prisma.file.findUnique({ where: { id } });
    if (!existing) return res.status(404).json({ error: 'File not found' });

    // permission: uploader or ADMIN
    const requesterId = req.user?.userId;
    const requesterRole = req.user?.role;
    if (existing.uploadedBy !== requesterId && requesterRole !== 'ADMIN') {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'New file not provided' });
    }

    // delete old file from disk
    await fs.unlink(existing.path).catch(() => {});

    // update record
    const updated = await prisma.file.update({
      where: { id },
      data: {
        filename: req.file.filename,
        originalName: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size,
        path: req.file.path
      }
    });

    res.json({ message: 'File updated', file: updated });
  } catch (error) {
    console.error('Update file error', error);
    // cleanup uploaded file if DB update failed
    if (req.file && req.file.path) {
      await fs.unlink(req.file.path).catch(() => {});
    }
    res.status(500).json({ error: 'Server error while updating file' });
  }
}

export const uploadFiles = async (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ error: 'No files uploaded' });
  }
  const userId = req.user?.userId;
  const files = await Promise.all(req.files.map(async file => {
    return await prisma.file.create({
      data: {
        filename: file.filename,
        originalName: file.originalname,
        mimetype: file.mimetype,
        size: file.size,
        path: file.path,
        uploadedBy: userId
      }
    });
  }));
  res.status(201).json({ message: 'Files uploaded', files });
};

export default { uploadFile, getFile, deleteFile, updateFile };
