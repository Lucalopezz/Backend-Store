import Order from "../models/Order.js";
import Cart from "../models/Cart.js";
import CartProduct from "../models/CartProduct.js";
import User from "../models/Users.js";
import Product from "../models/Products.js";
import getToken from "../utils/GetToken.js";
import getUserByToken from "../utils/GetUserByToken.js";

export default class OrderController {
  static async createOrder(req, res) {
    try {
      const token = getToken(req);
      const user = await getUserByToken(token);

      const cart = await Cart.findOne({
        where: { UserId: user.id },
        include: [{ model: Product, through: CartProduct }],
      });

      if (!cart) {
        return res
          .status(404)
          .json({ message: "Carrinho não encontrado para este usuário." });
      }

      const order = await Order.create({ UserId: user.id });
      
      await Promise.all(
        cart.Products.map(async (product) => {
          const productQuantity = product.CartProduct.quantity;
          if (product.quantity >= productQuantity) {
            await Product.update(
              { quantity: product.quantity - productQuantity },
              { where: { id: product.id } }
            );
            await order.addProduct(product, {
              through: { quantity: productQuantity },
            });
          } else {

            return res.status(400).json({
              message: `Estoque insuficiente para o produto: ${product.name}`,
            });
          }
        })
      );

      await CartProduct.destroy({ where: { cartId: cart.id } });

      res.status(201).json({ message: "Pedido criado com sucesso." });
    } catch (error) {
      console.error("Erro ao criar pedido:", error);
      res.status(500).json({ error: "Erro interno do servidor." });
    }
  }
  static async listOrders() {}
  static async updateOrderStatus() {}
  static async deleteOrder() {}
}
