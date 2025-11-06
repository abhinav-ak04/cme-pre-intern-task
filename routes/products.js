import express from 'express';
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProductById,
  removeProductById,
} from '../controllers/products.js';

const router = express.Router();

// GET /products
router.get('/', getAllProducts);

// GET /products/:id
router.get('/:id', getProductById);

// POST /products
router.post('/', createProduct);

// PUT /products/:id
router.put('/:id', updateProductById);

// DELETE /products/:id
router.delete('/:id', removeProductById);

export default router;
