import 'dotenv/config';

import dotenv from 'dotenv';
dotenv.config();

import cors from 'cors';
import express from 'express';

import { connectDB } from './db/connect.js';
import productRoutes from './routes/products.js';

const app = express();
const PORT = process.env.PORT || 8000;

// Middlewares
app.use(express.json());
app.use(cors());

// Routes
app.get('/', (req, res) => res.send('API is working fine 👍'));

app.use('/products', productRoutes);

// Error handling middleware

// Server running
app.listen(PORT, () => {
  console.log(`🌐 Server is running on http://localhost:${PORT}`);
  connectDB();
});
