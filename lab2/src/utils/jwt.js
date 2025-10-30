import jwt from 'jsonwebtoken';

/**
 * Generate an access token for the user
 * @param {number} userId - User ID
 * @param {string} role - User role (USER, MODERATOR, ADMIN)
 * @returns {string} JWT access token
 */
export function generateAccessToken(userId, role) {
    return jwt.sign(
        { userId, role },
        process.env.JWT_SECRET || 'your-secret-key-here',
        { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );
}

/**
 * Generate a refresh token for the user
 * @param {number} userId - User ID
 * @returns {string} JWT refresh token
 */
export function generateRefreshToken(userId) {
    return jwt.sign(
        { userId },
        process.env.REFRESH_TOKEN_SECRET || 'your-refresh-secret-here',
        { expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || '30d' }
    );
}

/**
 * Verify access token
 * @param {string} token - JWT access token to verify
 * @returns {Object} Decoded token payload
 */
export function verifyAccessToken(token) {
    try {
        return jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key-here');
    } catch (error) {
        throw new Error('Invalid access token');
    }
}

/**
 * Verify refresh token
 * @param {string} token - JWT refresh token to verify
 * @returns {Object} Decoded token payload
 */
export function verifyRefreshToken(token) {
    try {
        return jwt.verify(token, process.env.REFRESH_TOKEN_SECRET || 'your-refresh-secret-here');
    } catch (error) {
        throw new Error('Invalid refresh token');
    }
}
// functions are exported above