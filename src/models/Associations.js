import User from './Users.js';
import Cart from './Cart.js';
import Product from './Products.js';
import Order from './Order.js';
import CartProduct from '../models/CartProduct.js';


export default function() {
    User.hasMany(Order);
    User.hasMany(Cart);
    User.belongsToMany(Product, { through: Cart });
    
    Product.belongsToMany(User, { through: Cart });
    Product.belongsToMany(Order, { through: 'ProductOrder' });
    
    Cart.belongsTo(User);
    Cart.belongsToMany(Product, { through: CartProduct });
    
    Order.belongsTo(User);
    Order.belongsToMany(Product, { through: 'ProductOrder' });
}