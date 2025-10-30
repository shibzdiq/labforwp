import request from 'supertest';
import { PrismaClient } from '@prisma/client';
import app from '../src/app.js';

describe('Rate limiting', () => {
  it('should limit login attempts', async () => {
    for (let i = 0; i < 6; i++) {
      await request(app).post('/api/auth/login').send({ email: 'fake@user.com', password: 'wrong' });
    }
    const res = await request(app).post('/api/auth/login').send({ email: 'fake@user.com', password: 'wrong' });
    expect(res.statusCode).toBe(429);
    expect(res.body.error).toMatch(/Too many login attempts/);
  });
});
