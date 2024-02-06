import Cart from "../models/Cart.js";
import CartProduct from "../models/CartProduct.js";
import Product from "../models/Products.js";
import User from "../models/Users.js";

import getToken from "../utils/GetToken.js";
import getUserByToken from "../utils/GetUserByToken.js";

export default class CartController {
  static async addToCart(req, res) {
    try {
      const token = getToken(req);
      const { productId, quantity } = req.body;

      const user = await getUserByToken(token);

      const product = await Product.findByPk(productId);

      if (!product) {
        return res.status(404).json({ message: "Produto não encontrado." });
      }

      if (product.quantity < quantity) {
        return res.status(422).json({ message: "Não há estoque suficiente!" });
      }

      let cart = await Cart.findOne({ where: { UserId: user.id } });

      if (!cart) {
        cart = await Cart.create({ UserId: user.id });
      }

      await cart.addProduct(product, { through: { quantity } }); // through, is how add a project to the cartProduct

      res
        .status(201)
        .json({ message: "Produto adicionado ao carrinho com sucesso." });
    } catch (error) {
      console.error("Erro ao adicionar produto ao carrinho:", error);
      res.status(500).json({ error: "Erro interno do servidor." });
    }
  }
  static async getCartItems(req, res) {
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
      const totalPrice = cart.Products.reduce((total, product) => {
        const productPrice = product.price || 0; 
        const productQuantity = product.CartProduct.quantity || 1; 
  
        return total + (productPrice * productQuantity);
      }, 0);
      
      res.status(200).json({ cart, totalPrice });
    } catch (error) {
      console.error("Erro ao obter itens do carrinho:", error);
      res.status(500).json({ error: "Erro interno do servidor." });
    }
  }
}
