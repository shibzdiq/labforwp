import request from 'supertest';
import { PrismaClient } from '@prisma/client';
import app from '../src/app.js';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const prisma = new PrismaClient();

describe('File upload API', () => {
  const fixturePath = path.join(__dirname, 'temp_upload.txt');
  beforeAll(async () => {
    await prisma.user.deleteMany({ where: { email: 'filetest@example.com' } });
    fs.writeFileSync(fixturePath, 'hello world');
  });
  afterAll(async () => {
    try { fs.unlinkSync(fixturePath); } catch {}
    await prisma.user.deleteMany({ where: { email: 'filetest@example.com' } });
    await prisma.file.deleteMany({ where: { originalName: 'temp_upload.txt' } });
    await prisma.$disconnect();
  });
  it('uploads, retrieves and deletes a file', async () => {
    const reg = await request(app)
      .post('/api/auth/register')
      .send({ email: 'filetest@example.com', username: 'filetest', password: 'filepassword123' });
    expect(reg.status).toBe(201);
    const login = await request(app)
      .post('/api/auth/login')
      .send({ email: 'filetest@example.com', password: 'filepassword123' });
    expect(login.status).toBe(200);
    const token = login.body.tokens.accessToken;
    const uploadRes = await request(app)
      .post('/api/files')
      .set('Authorization', `Bearer ${token}`)
      .attach('file', fixturePath);
    expect(uploadRes.status).toBe(201);
    expect(uploadRes.body).toHaveProperty('file');
    const fileId = uploadRes.body.file.id;
    // update (replace) - create second fixture
    const fixture2 = path.join(__dirname, 'temp_upload2.txt');
    fs.writeFileSync(fixture2, 'new content');

    const updateRes = await request(app)
      .put(`/api/files/${fileId}`)
      .set('Authorization', `Bearer ${token}`)
      .attach('file', fixture2);

    expect(updateRes.status).toBe(200);
    expect(updateRes.body).toHaveProperty('file');
    expect(updateRes.body.file.originalName).toBe('temp_upload2.txt');

    // get
    const getRes = await request(app)
      .get(`/api/files/${fileId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(getRes.status).toBe(200);

    // create another user and try to delete (should be forbidden)
    await prisma.user.deleteMany({ where: { email: 'other@example.com' } }).catch(() => {});
    const reg2 = await request(app)
      .post('/api/auth/register')
      .send({ email: 'other@example.com', username: 'otheruser', password: 'otherpassword123' });
    expect([201, 409]).toContain(reg2.status);

    const login2 = await request(app)
      .post('/api/auth/login')
      .send({ email: 'other@example.com', password: 'otherpassword123' });
    expect(login2.status).toBe(200);
    const otherToken = login2.body.tokens.accessToken;

    const delForbidden = await request(app)
      .delete(`/api/files/${fileId}`)
      .set('Authorization', `Bearer ${otherToken}`);

    expect(delForbidden.status).toBe(403);

    // delete as owner
    const delRes = await request(app)
      .delete(`/api/files/${fileId}`)
      .set('Authorization', `Bearer ${token}`);

    expect([200, 204]).toContain(delRes.status);
  });
});
