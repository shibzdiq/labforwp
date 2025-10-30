import request from 'supertest';
import { PrismaClient } from '@prisma/client';
import app from '../src/app.js';

describe('Permissions', () => {
  const prisma = new PrismaClient();
  let userToken;
  beforeAll(async () => {
    await prisma.user.deleteMany({ where: { email: 'permtest@example.com' } });
    const reg = await request(app)
      .post('/api/auth/register')
      .send({ email: 'permtest@example.com', username: 'permtest', password: 'permtest123' });
    const login = await request(app)
      .post('/api/auth/login')
      .send({ email: 'permtest@example.com', password: 'permtest123' });
    userToken = login.body.tokens.accessToken;
  });
  afterAll(async () => {
    await prisma.user.deleteMany({ where: { email: 'permtest@example.com' } });
    await prisma.$disconnect();
  });
  it('should forbid non-admin assign', async () => {
    const res = await request(app)
      .post('/api/permissions/assign')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ userId: 1, permissionName: 'CAN_EDIT' });
    expect(res.statusCode).toBe(403);
  });
  // For real test, use a valid admin JWT
});
