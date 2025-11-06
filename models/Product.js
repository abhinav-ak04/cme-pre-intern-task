import { DataTypes } from 'sequelize';

export const createProductModel = async (sequelize) => {
  const Product = sequelize.define('Product', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: { type: DataTypes.STRING },
    description: { type: DataTypes.TEXT },
    price: { type: DataTypes.FLOAT },
    quantity: { type: DataTypes.INTEGER },
  });
  return Product;
};
