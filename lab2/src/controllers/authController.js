import { PrismaClient } from '@prisma/client';
import { hashPassword, comparePassword } from '../utils/password.js';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/jwt.js';
import { sendMail } from '../utils/email.js';
import { generateTOTPSecret, generateQRCodeDataURL, verifyTOTP } from '../utils/twofa.js';
import crypto from 'crypto';
import { OAuth2Client } from 'google-auth-library';

const prisma = new PrismaClient();

export const register = async (req, res) => {
    try {
        const { email, username, password } = req.body;

        // Validate required fields
        if (!email || !username || !password) {
            return res.status(400).json({
                error: 'Email, username and password are required'
            });
        }

        // Validate password length
        if (password.length < 8) {
            return res.status(400).json({
                error: 'Password must be at least 8 characters long'
            });
        }

        // Check if user exists
        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [
                    { email },
                    { username }
                ]
            }
        });

        if (existingUser) {
            if (existingUser.username === username) {
                return res.status(409).json({
                    error: 'Username already exists'
                });
            }
            if (existingUser.email === email) {
                return res.status(409).json({
                    error: 'Email already exists'
                });
            }
        }

        // Hash password
        const hashedPassword = await hashPassword(password);

        // Create user
        const user = await prisma.user.create({
            data: {
                email,
                username,
                password: hashedPassword,
                role: 'USER'
            },
            select: {
                id: true,
                email: true,
                username: true,
                role: true,
                createdAt: true
            }
        });

        // Generate tokens
        const accessToken = generateAccessToken(user.id, user.role);
        const refreshToken = generateRefreshToken(user.id);

        // Update user with refresh token
        await prisma.user.update({
            where: { id: user.id },
            data: { 
                refreshToken,
                lastLogin: new Date()
            }
        });

        res.status(201).json({
            message: 'User successfully registered',
            user,
            tokens: {
                accessToken,
                refreshToken
            }
        });

    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({
            error: 'Server error during registration'
        });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password, totp } = req.body;

        // Validate required fields
        if (!email || !password) {
            return res.status(400).json({
                error: 'Email and password are required'
            });
        }

        // Find user
        const user = await prisma.user.findUnique({
            where: { email }
        });

        if (!user) {
            return res.status(401).json({
                error: 'Invalid email or password'
            });
        }

        // Verify password
        const isPasswordValid = await comparePassword(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({
                error: 'Invalid email or password'
            });
        }

        // If 2FA is enabled for user, verify TOTP token
        if (user.is2faEnabled) {
            if (!totp) {
                return res.status(401).json({ error: '2FA token required' });
            }
            const totpValid = verifyTOTP(totp, user.totpSecret || '');
            if (!totpValid) {
                return res.status(401).json({ error: 'Invalid 2FA token' });
            }
        }

        // Generate tokens
        const accessToken = generateAccessToken(user.id, user.role);
        const refreshToken = generateRefreshToken(user.id);

        // Update user with refresh token and last login
        await prisma.user.update({
            where: { id: user.id },
            data: { 
                refreshToken,
                lastLogin: new Date()
            }
        });

        // Remove sensitive data
        const { password: _, refreshToken: __, ...userWithoutSensitiveData } = user;

        res.json({
            message: 'Login successful',
            user: userWithoutSensitiveData,
            tokens: {
                accessToken,
                refreshToken
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            error: 'Server error during login'
        });
    }
};

export const refreshToken = async (req, res) => {
    try {
        const { refreshToken: token } = req.body;

        if (!token) {
            return res.status(400).json({
                error: 'Refresh token is required'
            });
        }

        // Verify refresh token
        const decoded = verifyRefreshToken(token);

        // Find user
        const user = await prisma.user.findUnique({
            where: { id: decoded.userId }
        });

        if (!user || user.refreshToken !== token) {
            return res.status(401).json({
                error: 'Invalid refresh token'
            });
        }

        // Generate new tokens
        const accessToken = generateAccessToken(user.id, user.role);
        const refreshToken = generateRefreshToken(user.id);

        // Update user with new refresh token
        await prisma.user.update({
            where: { id: user.id },
            data: { refreshToken }
        });

        res.json({
            tokens: {
                accessToken,
                refreshToken
            }
        });

    } catch (error) {
        console.error('Token refresh error:', error);
        res.status(401).json({
            error: 'Invalid refresh token'
        });
    }
};

export const logout = async (req, res) => {
    try {
        // Clear refresh token in database
        await prisma.user.update({
            where: { id: req.user.userId },
            data: { refreshToken: null }
        });

        res.json({
            message: 'Successfully logged out'
        });
    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({
            error: 'Server error during logout'
        });
    }
};

export const changePassword = async (req, res) => {
    try {
        const userId = req.user?.userId;
        const { oldPassword, newPassword } = req.body;

        if (!oldPassword || !newPassword) {
            return res.status(400).json({ error: 'Old and new passwords are required' });
        }

        if (newPassword.length < 8) {
            return res.status(400).json({ error: 'New password must be at least 8 characters long' });
        }

        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user) return res.status(404).json({ error: 'User not found' });

        const isMatch = await comparePassword(oldPassword, user.password);
        if (!isMatch) return res.status(401).json({ error: 'Old password is incorrect' });

        const hashed = await hashPassword(newPassword);

        // update password and invalidate refresh token
        await prisma.user.update({
            where: { id: userId },
            data: { password: hashed, refreshToken: null }
        });

        res.json({ message: 'Password changed successfully; please log in again' });
    } catch (error) {
        console.error('Change password error:', error);
        res.status(500).json({ error: 'Server error while changing password' });
    }
};

export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) return res.status(400).json({ error: 'Email is required' });

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            // Don't reveal whether email exists
            return res.json({ message: 'If that email is registered, a reset link has been sent' });
        }

        const token = crypto.randomBytes(32).toString('hex');
        const expires = new Date(Date.now() + (parseInt(process.env.PASSWORD_RESET_EXPIRES_MS || '3600000')));

        await prisma.user.update({ where: { id: user.id }, data: { passwordResetToken: token, passwordResetExpires: expires } });

        const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password?token=${token}`;
        const subject = 'Password reset request';
        const text = `You requested a password reset. Click the link to reset: ${resetUrl}`;

        const { previewUrl } = await sendMail({ to: email, subject, text });

        return res.json({ message: 'If that email is registered, a reset link has been sent', previewUrl });
    } catch (error) {
        console.error('Forgot password error', error);
        res.status(500).json({ error: 'Server error' });
    }
};

export const resetPassword = async (req, res) => {
    try {
        const { token, newPassword } = req.body;
        if (!token || !newPassword) return res.status(400).json({ error: 'Token and newPassword are required' });
        if (newPassword.length < 8) return res.status(400).json({ error: 'New password must be at least 8 characters long' });

        const user = await prisma.user.findFirst({ where: { passwordResetToken: token } });
        if (!user || !user.passwordResetExpires || user.passwordResetExpires < new Date()) {
            return res.status(400).json({ error: 'Invalid or expired token' });
        }

        const hashed = await hashPassword(newPassword);
        await prisma.user.update({ where: { id: user.id }, data: { password: hashed, passwordResetToken: null, passwordResetExpires: null, refreshToken: null } });

        res.json({ message: 'Password has been reset. Please log in.' });
    } catch (error) {
        console.error('Reset password error', error);
        res.status(500).json({ error: 'Server error' });
    }
};

export const setup2fa = async (req, res) => {
    try {
        const userId = req.user?.userId;
        if (!userId) return res.status(401).json({ error: 'Not authenticated' });

        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user) return res.status(404).json({ error: 'User not found' });

        const secret = generateTOTPSecret({ name: `${process.env.APP_NAME || 'lab-app'} (${user.email})` });

        // Store base32 secret in DB (for demo/lab purposes)
        await prisma.user.update({ where: { id: userId }, data: { totpSecret: secret.base32 } });

        const qr = await generateQRCodeDataURL(secret.otpauth_url);

        res.json({ message: '2FA setup initiated', otpauth_url: secret.otpauth_url, base32: secret.base32, qr });
    } catch (error) {
        console.error('Setup 2FA error', error);
        res.status(500).json({ error: 'Server error' });
    }
};

export const verify2fa = async (req, res) => {
    try {
        const userId = req.user?.userId;
        const { token } = req.body;
        if (!userId) return res.status(401).json({ error: 'Not authenticated' });
        if (!token) return res.status(400).json({ error: 'Token is required' });

        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user || !user.totpSecret) return res.status(400).json({ error: '2FA not initialized for user' });

        const ok = verifyTOTP(token, user.totpSecret);
        if (!ok) return res.status(401).json({ error: 'Invalid 2FA token' });

        await prisma.user.update({ where: { id: userId }, data: { is2faEnabled: true } });

        res.json({ message: '2FA has been enabled for your account' });
    } catch (error) {
        console.error('Verify 2FA error', error);
        res.status(500).json({ error: 'Server error' });
    }
};

export const oauthGoogle = async (req, res) => {
    try {
        const { idToken } = req.body;
        if (!idToken) return res.status(400).json({ error: 'idToken is required' });
        const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
        let payload;
        try {
            const ticket = await client.verifyIdToken({ idToken, audience: process.env.GOOGLE_CLIENT_ID });
            payload = ticket.getPayload();
        } catch (err) {
            return res.status(401).json({ error: 'Invalid Google ID token' });
        }
        const email = payload.email;
        if (!email) return res.status(400).json({ error: 'No email in Google profile' });
        let user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            user = await prisma.user.create({
                data: {
                    email,
                    username: payload.name || email.split('@')[0],
                    password: '',
                    role: 'USER',
                    avatar: payload.picture || null
                }
            });
        }
        const accessToken = generateAccessToken(user.id, user.role);
        const refreshToken = generateRefreshToken(user.id);
        await prisma.user.update({ where: { id: user.id }, data: { refreshToken, lastLogin: new Date() } });
        res.json({
            message: 'OAuth login successful',
            user: { id: user.id, email: user.email, username: user.username, role: user.role, avatar: user.avatar },
            tokens: { accessToken, refreshToken }
        });
    } catch (error) {
        console.error('OAuth Google error:', error);
        res.status(500).json({ error: 'Server error during OAuth login' });
    }
};