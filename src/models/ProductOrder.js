import { DataTypes } from 'sequelize';
import sequelize from '../database/conn.js';

const ProductOrder = sequelize.define('ProductOrder', {
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

export default ProductOrder;