import { DataTypes } from 'sequelize';
import sequelize from '../database/conn.js';

const CartProduct = sequelize.define('CartProduct', {
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

export default CartProduct;