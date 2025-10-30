import express from 'express';
import dotenv from 'dotenv';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import cardRoutes from './routes/cardRoutes.js';
import collectionRoutes from './routes/collectionRoutes.js';
import transactionRoutes from './routes/transactionRoutes.js';
import fileRoutes from './routes/fileRoutes.js';
import auditRoutes from './routes/auditRoutes.js';
import permissionRoutes from './routes/permissionRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();

const app = express();

// Security middleware
app.use(helmet());
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true
}));

// Rate limiting
const limiter = rateLimit({
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
    max: parseInt(process.env.RATE_LIMIT_MAX) || 100,
    message: {
        error: 'Too many requests from this IP, please try again later'
    }
});

app.use('/api/', limiter);

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
	try {
		if (typeof req.url === 'string') {
			const cleaned = req.url.replace(/[\r\n]+/g, '').trim();
			if (cleaned !== req.url) {
				req.url = cleaned;
			}
		}
	} catch (e) {
	}
	next();
});

// Swagger configuration
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Trading Cards API Documentation',
            version: '2.0.0',
            description: 'API documentation for Trading Cards application'
        },
        servers: [
            {
                url: `http://localhost:${process.env.PORT || 3000}`,
                description: 'Development server'
            }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT'
                }
            },
            schemas: {
                User: {
                    type: 'object',
                    properties: {
                        id: { type: 'integer' },
                        username: { type: 'string' },
                        email: { type: 'string', format: 'email' },
                        role: { type: 'string' },
                        createdAt: { type: 'string', format: 'date-time' }
                    }
                },
                Tokens: {
                    type: 'object',
                    properties: {
                        accessToken: { type: 'string' },
                        refreshToken: { type: 'string' }
                    }
                },
                Pagination: {
                    type: 'object',
                    properties: {
                        page: { type: 'integer' },
                        limit: { type: 'integer' },
                        total: { type: 'integer' },
                        totalPages: { type: 'integer' },
                        hasMore: { type: 'boolean' }
                    }
                },
                Card: {
                    type: 'object',
                    properties: {
                        id: { type: 'integer' },
                        name: { type: 'string' },
                        description: { type: 'string' },
                        rarity: { type: 'string' },
                        imageUrl: { type: 'string' },
                        ownerId: { type: 'integer' },
                        createdAt: { type: 'string', format: 'date-time' }
                    }
                },
                Collection: {
                    type: 'object',
                    properties: {
                        id: { type: 'integer' },
                        name: { type: 'string' },
                        description: { type: 'string' },
                        isPublic: { type: 'boolean' },
                        createdAt: { type: 'string', format: 'date-time' }
                    }
                },
                Transaction: {
                    type: 'object',
                    properties: {
                        id: { type: 'integer' },
                        buyerId: { type: 'integer' },
                        sellerId: { type: 'integer' },
                        cardId: { type: 'integer' },
                        price: { type: 'number' },
                        createdAt: { type: 'string', format: 'date-time' }
                    }
                },
                File: {
                    type: 'object',
                    properties: {
                        id: { type: 'integer' },
                        filename: { type: 'string' },
                        originalName: { type: 'string' },
                        mimetype: { type: 'string' },
                        size: { type: 'integer' },
                        path: { type: 'string' },
                        uploadedBy: { type: 'integer' },
                        createdAt: { type: 'string', format: 'date-time' }
                    }
                },
                Error: {
                    type: 'object',
                    properties: {
                        error: { type: 'string' }
                    },
                    example: { error: 'Invalid credentials' }
                }
            }
        },
        security: [{
            bearerAuth: []
        }]
    },
    apis: [
        join(__dirname, './routes/*.js'),
        join(__dirname, './controllers/*.js')
    ]
};
const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Static file serving
app.use('/uploads', express.static(join(__dirname, '..', process.env.UPLOAD_DIR || 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/cards', cardRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/collections', collectionRoutes);
app.use('/api/files', fileRoutes);
app.use('/api/audit', auditRoutes);
app.use('/api/permissions', permissionRoutes);

// Error handling
app.use((err, req, res, next) => {
    console.error(err);

    // Handle Multer errors
    if (err.name === 'MulterError') {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
                error: 'File is too large'
            });
        }
        return res.status(400).json({
            error: 'File upload error'
        });
    }

    // Handle Prisma errors
    if (err?.code === 'P2002') {
        const target = err.meta?.target?.join(', ') || 'unique field';
        return res.status(409).json({
            error: `Unique constraint failed on: ${target}`
        });
    }

    if (err?.code === 'P2003') {
        return res.status(400).json({
            error: err.message || 'Foreign key constraint violated'
        });
    }

    // Handle other errors
    res.status(err.status || 500).json({
        error: err.message || 'Internal Server Error'
    });
});

const PORT = process.env.PORT || 3000;
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`API Documentation: http://localhost:${PORT}/api-docs`);
  });
}
export default app;
