import request from 'supertest';
import { PrismaClient } from '@prisma/client';
import app from '../src/app.js';

describe('Google OAuth login', () => {
  it('should fail with no idToken', async () => {
    const res = await request(app).post('/api/auth/oauth/google').send({});
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toMatch(/idToken is required/);
  });
  // For real test, you need a valid idToken. For CI/dev, skip or mock.
});
