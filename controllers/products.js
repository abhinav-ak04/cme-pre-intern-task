import { ProductModel } from '../db/connect.js';
import { StatusCodes } from '../utils/status-codes.js';
import logger from '../utils/logger.js';

export const getAllProducts = async (req, res) => {
  const { OK, INTERNAL_SERVER_ERROR } = StatusCodes;

  try {
    const products = await ProductModel.findAll();

    logger.info(
      { nbHits: products.length },
      'Fetched all products successfully'
    );

    return res.status(OK).json({ products, nbHits: products.length });
  } catch (error) {
    logger.error({ err: error }, 'Error fetching products');

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
      logger.warn({ id }, 'Product ID missing in request');
      return res.status(BAD_REQUEST).json({ message: 'Product ID is missing' });
    }

    const product = await ProductModel.findOne({ where: { id } });

    if (!product) {
      logger.warn({ id }, 'Product not found');
      return res.status(NOT_FOUND).json({ message: 'Product not found' });
    }

    logger.info({ id }, 'Fetched product successfully');
    res.status(OK).json({ product });
  } catch (error) {
    logger.error(
      { err: error, params: req.params },
      'Error fetching product by ID'
    );
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
      logger.warn({ body: req.body }, 'Missing required product fields');
      return res
        .status(BAD_REQUEST)
        .json({ message: 'One of the fields are missing' });
    }

    const product = await ProductModel.create(req.body);

    logger.info({ productId: product.id }, 'Product created successfully');

    return res
      .status(CREATED)
      .json({ message: 'Product created successfully', product });
  } catch (error) {
    logger.error({ err: error, body: req.body }, 'Error creating product');
    return res
      .status(INTERNAL_SERVER_ERROR)
      .json({ message: 'Internal Server Error' });
  }
};

export const updateProductById = async (req, res) => {
  const { OK, BAD_REQUEST, NOT_FOUND, INTERNAL_SERVER_ERROR } = StatusCodes;

  try {
    const { id } = req.params;

    if (!id) {
      logger.warn({ id }, 'Product ID missing in update request');
      return res.status(BAD_REQUEST).json({ message: 'Product ID is missing' });
    }

    const product = await ProductModel.findOne({ where: { id } });
    if (!product) {
      logger.warn({ id }, 'Product not found when updating');
      return res.status(NOT_FOUND).json({ message: 'Product ID not found' });
    }

    // const { name, description, price, quantity } = req.body;

    await product.update(req.body, { where: { id } });
    await product.save();

    logger.info(
      { id, updatedFields: req.body },
      'Product updated successfully'
    );

    return res
      .status(OK)
      .json({ message: 'Product updated successfully', product });
  } catch (error) {
    logger.error({ err: error, id, body: req.body }, 'Error updating product');
    return res
      .status(INTERNAL_SERVER_ERROR)
      .json({ message: 'Internal Server Error', error });
  }
};

export const removeProductById = async (req, res) => {
  const { OK, BAD_REQUEST, NOT_FOUND, INTERNAL_SERVER_ERROR } = StatusCodes;

  try {
    const { id } = req.params;

    if (!id) {
      logger.warn({ id }, 'Product ID missing in delete request');
      return res.status(BAD_REQUEST).json({ message: 'Product ID is missing' });
    }

    const product = await ProductModel.findOne({ where: { id } });
    if (!product) {
      logger.warn({ id }, 'Product not found when deleting');
      return res.status(NOT_FOUND).json({ message: 'Product ID not found' });
    }

    // const { name, description, price, quantity } = req.body;

    await product.destroy();

    logger.info({ id }, 'Product removed successfully');

    return res
      .status(OK)
      .json({ message: 'Product removed successfully', product });
  } catch (error) {
    logger.error({ err: error, id }, 'Error removing product');
    res
      .status(INTERNAL_SERVER_ERROR)
      .json({ message: 'Internal Server Error', error });
  }
};
