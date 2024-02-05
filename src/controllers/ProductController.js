import Product from "../models/Products.js";

export default class UserController {
  static async createProduct(req, res) {
    const { name, description, price, quantity } = req.body;

    const images = req.file;

    switch (true) {
      case !name:
        res.status(422).json({ message: "O nome é obrigatório!" });
        return;
      case !description:
        res.status(422).json({ message: "A descrição é obrigatória!" });
        return;
      case !price:
        res.status(422).json({ message: "O preço é obrigatório!" });
        return;
      case !quantity:
        res.status(422).json({ message: "A quantidade é obrigatória!" });
        return;
      case !images:
        res.status(422).json({ message: "A imagem é obrigatória!" });
        return;
      case quantity < 1:
        res.status(422).json({ message: "A quantidade é obrigatória!" });
        return;
      default:
        break;
    }

    try {
      const newProduc = await Product.create({
        name,
        description,
        price,
        quantity,
        images: images.filename,
      });
      res.status(200).json({ message: "Produto criado com sucesso!" });
    } catch (error) {
      console.error("Erro durante o registro de produto:", error);
      res.status(500).json({ message: "Erro durante o registro do produto." });
      return;
    }
  }
  static async listProducts(req, res) {
    const products = await Product.findAll({
      order: [["createdAt", "DESC"]],
    });
    res.status(200).json({ products: products });
  }
  static async deleteProducts(req, res) {
    const id = req.params.id;

    const product = await Product.findByPk(id);
    if (!product) {
      res.status(422).json({ message: "Produto não existe!" });
      return;
    }
    try {
      const result = await Product.destroy({
        where: {
          id: id,
        },
      });
      res.status(200).json({ message: " O delete do produto, foi realizado!." });

    } catch (error) {
      console.error("Erro durante o delete de produto:", error);
      res.status(500).json({ message: "Erro durante o delete do produto." });
      return;
    }
  }
}
