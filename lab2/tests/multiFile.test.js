import request from 'supertest';
import { PrismaClient } from '@prisma/client';
import app from '../src/app.js';
import path from 'path';

describe('Multiple file upload', () => {
  const prisma = new PrismaClient();
  let userToken;
  beforeAll(async () => {
    await prisma.user.deleteMany({ where: { email: 'multifiletest@example.com' } });
    const reg = await request(app)
      .post('/api/auth/register')
      .send({ email: 'multifiletest@example.com', username: 'multifiletest', password: 'multifiletest123' });
    const login = await request(app)
      .post('/api/auth/login')
      .send({ email: 'multifiletest@example.com', password: 'multifiletest123' });
    userToken = login.body.tokens.accessToken;
  });
  afterAll(async () => {
    await prisma.user.deleteMany({ where: { email: 'multifiletest@example.com' } });
    await prisma.$disconnect();
  });
  it('should fail with no files', async () => {
    const res = await request(app)
      .post('/api/files/multi')
      .set('Authorization', `Bearer ${userToken}`)
      .send();
    expect(res.statusCode).toBe(400);
  });
  // For real test, use valid JWT and files
});
