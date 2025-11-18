import 'dotenv/config';

import dotenv from 'dotenv';
dotenv.config();

import cors from 'cors';
import express from 'express';

import { connectDB } from './db/connect.js';
import productRoutes from './routes/products.js';
import logger from './utils/logger.js';

const app = express();
const PORT = process.env.PORT || 8000;

// Middlewares
app.use(express.json());
app.use(cors());

// Simple HTTP request logger middleware
app.use((req, res, next) => {
  const start = process.hrtime.bigint();

  res.on('finish', () => {
    const end = process.hrtime.bigint();
    const durationMs = Number(end - start) / 1e6; // convert ns → ms

    // DEBUG: force something obvious into logs
    console.log('DEBUG_HTTP_LOG', req.method, req.path, res.statusCode);

    logger.info(
      {
        event: 'http_request_completed',
        method: req.method,
        path: req.path,
        status: res.statusCode,
        duration_ms: durationMs,
      },
      'Handled HTTP request'
    );
  });

  next();
});

// Simple request log (optional, but nice)
app.use((req, res, next) => {
  logger.info({ method: req.method, path: req.path }, 'Incoming request');
  next();
});

// Routes
app.get('/', (req, res) => res.send('API is working fine 👍'));

app.use('/products', productRoutes);

// Server running
app.listen(PORT, () => {
  logger.info({ port: PORT }, `Server is running on http://localhost:${PORT}`);
  connectDB();
});

export default app;
