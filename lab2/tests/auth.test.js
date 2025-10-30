import request from 'supertest';
import { PrismaClient } from '@prisma/client';
import app from '../src/app.js';

const prisma = new PrismaClient();

describe('Authentication API', () => {
    beforeAll(async () => {
        await prisma.user.deleteMany({ where: { email: 'test@example.com' } });
    });
    afterAll(async () => {
        await prisma.user.deleteMany({ where: { email: 'test@example.com' } });
        await prisma.$disconnect();
    });
    it('should register, login and refresh tokens', async () => {
        const registerRes = await request(app)
            .post('/api/auth/register')
            .send({ email: 'test@example.com', username: 'testuser', password: 'testpassword123' });
        expect(registerRes.status).toBe(201);
        expect(registerRes.body).toHaveProperty('tokens');
        const loginRes = await request(app)
            .post('/api/auth/login')
            .send({ email: 'test@example.com', password: 'testpassword123' });
        expect(loginRes.status).toBe(200);
        expect(loginRes.body).toHaveProperty('tokens');
        const refreshRes = await request(app)
            .post('/api/auth/refresh')
            .send({ refreshToken: loginRes.body.tokens.refreshToken });
        expect(refreshRes.status).toBe(200);
        expect(refreshRes.body).toHaveProperty('tokens');
    });
});