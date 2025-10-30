import request from 'supertest';
import { PrismaClient } from '@prisma/client';
import app from '../src/app.js';

const prisma = new PrismaClient();

describe('Change password flow', () => {
    beforeAll(async () => {
        await prisma.user.deleteMany({ where: { email: 'changetest@example.com' } });
    });
    afterAll(async () => {
        await prisma.user.deleteMany({ where: { email: 'changetest@example.com' } });
        await prisma.$disconnect();
    });
    it('should change password and require re-login', async () => {
        const reg = await request(app)
            .post('/api/auth/register')
            .send({ email: 'changetest@example.com', username: 'changetest', password: 'oldpassword123' });
        expect(reg.status).toBe(201);
        const login = await request(app)
            .post('/api/auth/login')
            .send({ email: 'changetest@example.com', password: 'oldpassword123' });
        expect(login.status).toBe(200);
        const token = login.body.tokens.accessToken;
        const change = await request(app)
            .post('/api/auth/change-password')
            .set('Authorization', `Bearer ${token}`)
            .send({ oldPassword: 'oldpassword123', newPassword: 'newpassword456' });
        expect(change.status).toBe(200);
        const loginOld = await request(app)
            .post('/api/auth/login')
            .send({ email: 'changetest@example.com', password: 'oldpassword123' });
        expect(loginOld.status).toBe(401);
        const loginNew = await request(app)
            .post('/api/auth/login')
            .send({ email: 'changetest@example.com', password: 'newpassword456' });
        expect(loginNew.status).toBe(200);
    });
});
