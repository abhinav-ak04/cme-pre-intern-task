import { ProductModel } from '../db/connect.js';
import { StatusCodes } from '../utils/status-codes.js';

export const getAllProducts = async (req, res) => {
  const { OK, INTERNAL_SERVER_ERROR } = StatusCodes;

  try {
    const products = await ProductModel.findAll();
    return res.status(OK).json({ products, nbHits: products.length });
  } catch (error) {
    console.error('Error fetching products:', error);
    return res
      .status(INTERNAL_SERVER_ERROR)
      .json({ message: 'Internal server error', error: error.message });
  }
};

export const getProductById = async (req, res) => {
  const { OK, BAD_REQUEST, NOT_FOUND, INTERNAL_SERVER_ERROR } = StatusCodes;

  try {
    const { id } = req.params;

    if (!id) {
      return res.status(BAD_REQUEST).json({ message: 'Product ID is missing' });
    }

    const product = await ProductModel.findOne({ where: { id } });

    if (!product)
      return res.status(NOT_FOUND).json({ message: 'Product not found' });

    res.status(OK).json({ product });
  } catch (error) {
    console.error('Error fetching product by ID:', error);
    res
      .status(INTERNAL_SERVER_ERROR)
      .json({ message: 'Internal server error' });
  }
};

export const createProduct = async (req, res) => {
  const { CREATED, BAD_REQUEST, INTERNAL_SERVER_ERROR } = StatusCodes;

  try {
    const { name, description, price, quantity } = req.body;
    if (!name || !description || !price || !quantity) {
      return res
        .status(BAD_REQUEST)
        .json({ message: 'One of the fields are missing' });
    }

    const product = await ProductModel.create(req.body);
    res
      .status(CREATED)
      .json({ message: 'Product created successfully', product });
  } catch (error) {
    console.error('Error creating product', error);
    res
      .status(INTERNAL_SERVER_ERROR)
      .json({ message: 'Internal Server Error' });
  }
};

export const updateProductById = async (req, res) => {
  const { OK, BAD_REQUEST, NOT_FOUND, INTERNAL_SERVER_ERROR } = StatusCodes;

  try {
    const { id } = req.params;

    if (!id) {
      return res.status(BAD_REQUEST).json({ message: 'Product ID is missing' });
    }

    const product = await ProductModel.findOne({ where: { id } });
    if (!product) {
      return res.status(NOT_FOUND).json({ message: 'Product ID not found' });
    }

    // const { name, description, price, quantity } = req.body;

    await product.update(req.body, { where: { id } });
    await product.save();
    return res
      .status(OK)
      .json({ message: 'Product updated successfully', product });
  } catch (error) {
    console.error('Error updating the product', error);
    res
      .status(INTERNAL_SERVER_ERROR)
      .json({ message: 'Internal Server Error', error });
  }
};

export const removeProductById = async (req, res) => {
  const { OK, BAD_REQUEST, NOT_FOUND, INTERNAL_SERVER_ERROR } = StatusCodes;

  try {
    const { id } = req.params;

    if (!id) {
      return res.status(BAD_REQUEST).json({ message: 'Product ID is missing' });
    }

    const product = await ProductModel.findOne({ where: { id } });
    if (!product) {
      return res.status(NOT_FOUND).json({ message: 'Product ID not found' });
    }

    // const { name, description, price, quantity } = req.body;

    await product.destroy();
    return res
      .status(OK)
      .json({ message: 'Product removed successfully', product });
  } catch (error) {
    console.error('Error removing the product', error);
    res
      .status(INTERNAL_SERVER_ERROR)
      .json({ message: 'Internal Server Error', error });
  }
};
