import express from 'express';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoutes.js';
import cardRoutes from './routes/cardRoutes.js';
import transactionRoutes from './routes/transactionRoutes.js';

dotenv.config();
const app = express();
app.use(express.json());

// Normalize incoming request URLs: remove trailing CR/LF and surrounding whitespace
app.use((req, res, next) => {
	try {
		if (typeof req.url === 'string') {
			// remove any carriage returns/newlines and trim spaces
			const cleaned = req.url.replace(/[\r\n]+/g, '').trim();
			if (cleaned !== req.url) {
				req.url = cleaned;
			}
		}
	} catch (e) {
		// don't block requests if something unexpected happens
	}
	next();
});

// Роутинг
app.use('/users', userRoutes);
app.use('/cards', cardRoutes);
app.use('/transactions', transactionRoutes);

// Centralized error handler (should be last middleware)
app.use((err, req, res, next) => {
	console.error(err);
	// Prisma errors may include code/meta
	if (err && err.code === 'P2002') {
		const target = err.meta && Array.isArray(err.meta.target) ? err.meta.target.join(', ') : 'unique field';
		return res.status(409).json({ error: `Unique constraint failed on: ${target}` });
	}
	if (err && err.code === 'P2003') {
		return res.status(400).json({ error: err.message || 'Foreign key constraint violated' });
	}
	res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
