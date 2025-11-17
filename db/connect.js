import { Sequelize } from 'sequelize';
import { createProductModel } from '../models/Product.js';
import logger from '../utils/logger.js';

const DB_NAME = process.env.DB_NAME || 'cme';
const DB_USER = process.env.DB_USER || 'postgres';
const DB_PASS = process.env.DB_PASS || 'default_password';
const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_PORT = process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 5432;
const DB_SSL = process.env.DB_SSL === 'true'; // "true" or "false"

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASS, {
  host: DB_HOST,
  port: DB_PORT,
  dialect: 'postgres',
  dialectOptions: DB_SSL
    ? {
        ssl: {
          require: true,
          rejectUnauthorized: false,
        },
      }
    : {},
});

let ProductModel = null;
const connectDB = async () => {
  try {
    logger.info(
      { DB_NAME, DB_HOST, DB_PORT, DB_USER },
      'Attempting to connect to PostgreSQL'
    );

    await sequelize.authenticate();
    logger.info('Connection has been established successfully.');

    ProductModel = await createProductModel(sequelize);
    await sequelize.sync();
    logger.info('Database synced successfully');
  } catch (error) {
    logger.error({ err: error }, 'Unable to connect to the database:');
  }
};

export { connectDB, ProductModel };
