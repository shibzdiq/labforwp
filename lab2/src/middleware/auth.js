import { verifyAccessToken } from '../utils/jwt.js';
import rateLimit from 'express-rate-limit';

/**
 * Authentication middleware
 * Verifies the JWT token and adds user data to the request
 */
export function authenticate(req, res, next) {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                error: 'Authentication token is missing'
            });
        }

        const token = authHeader.substring(7);
        const decoded = verifyAccessToken(token);

        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({
            error: 'Invalid or expired token'
        });
    }
}

// single named export above

export const loginLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 хвилин
  max: 5,
  message: { error: 'Too many login attempts, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false
});

export const forgotLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 хвилин
  max: 3,
  message: { error: 'Too many password reset requests, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false
});

export const resetLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 3,
  message: { error: 'Too many password reset attempts, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false
});