import Order from "../models/Order.js";
import Cart from "../models/Cart.js";
import CartProduct from "../models/CartProduct.js";
import ProductOrder from "../models/ProductOrder.js";
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
      res.status(500).json({ message: "Erro interno do servidor." });
    }
  }
  static async listOrders(req, res) {
    const token = getToken(req);
    const user = await getUserByToken(token);

    try {
      const order = await Order.findOne({
        where: { UserId: user.id },
        include: [{ model: Product, through: ProductOrder }],
      });
      if (!order) {
        return res
          .status(404)
          .json({ message: "Carrinho não encontrado para este usuário." });
      }
      res.status(200).json({ order });
    } catch (error) {
      console.error("Erro ao obter itens do carrinho:", error);
      res.status(500).json({ message: "Erro interno do servidor." });
    }
  }
  static async updateOrderStatus(req, res) {
    const { orderId, step } = req.body;

    if (!step || !orderId) {
      return res.status(422).json({ message: "orderId e step são requeridos" });
    }

    try {
      const order = await Order.findByPk(orderId);

      order.status = step;

      await order.save();
      res.status(200).json({ message: "Atualizado!" });
    } catch (error) {
      console.error("Erro ao obter itens do carrinho:", error);
      res.status(500).json({ message: "Erro interno do servidor." });
    }
  }

}
