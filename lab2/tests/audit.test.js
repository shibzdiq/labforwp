import request from 'supertest';
import { PrismaClient } from '@prisma/client';
import app from '../src/app.js';

describe('Audit logging', () => {
  const prisma = new PrismaClient();
  let userToken;
  beforeAll(async () => {
    await prisma.user.deleteMany({ where: { email: 'audittest@example.com' } });
    const reg = await request(app)
      .post('/api/auth/register')
      .send({ email: 'audittest@example.com', username: 'audittest', password: 'audittest123' });
    const login = await request(app)
      .post('/api/auth/login')
      .send({ email: 'audittest@example.com', password: 'audittest123' });
    userToken = login.body.tokens.accessToken;
  });
  afterAll(async () => {
    await prisma.user.deleteMany({ where: { email: 'audittest@example.com' } });
    await prisma.$disconnect();
  });
  it('should forbid non-admin access', async () => {
    const res = await request(app)
      .get('/api/audit')
      .set('Authorization', `Bearer ${userToken}`);
    expect(res.statusCode).toBe(403);
  });
  // For real test, use a valid admin JWT
});
