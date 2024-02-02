import Jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

import User from "../models/Users.js";
import CreateUserToken from "../utils/CreateUserToken.js";

export default class UserController {
  static async register(req, res) {
    const { username, email, firstName, lastName, password, confirmpassword } =
      req.body;

    switch (true) {
      case !username:
        res.status(422).json({ message: "O nome é obrigatório!" });
        return;

      case !email:
        res.status(422).json({ message: "O e-mail é obrigatório!" });
        return;

        return;
      case !firstName:
        res.status(422).json({ message: "O telefone é obrigatório!" });
        return;
      case !lastName:
        res.status(422).json({ message: "O telefone é obrigatório!" });
        return;

      case !password:
        res.status(422).json({ message: "A senha é obrigatória!" });
        return;
      case !confirmpassword:
        res
          .status(422)
          .json({ message: "A confirmação de senha é obrigatória!" });
        return;

      case password !== confirmpassword:
        res
          .status(422)
          .json({ message: "A confirmação e a senha são diferentes" });
        return;
      default:
        break;
    }
    const userExist = await User.findOne({ where: { email: email } });

    if (userExist) {
      res.status(422).json({
        message: "O E-mail já está cadastrado! Use outro",
      });
      return;
    }

    //password
    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);

    try {
      const newUser = await User.create({
        username,
        email,
        firstName,
        lastName,
        password: passwordHash,
      });
      await CreateUserToken(newUser, req, res);
    } catch (error) {
      console.error("Erro durante o registro:", error);
      res.status(500).json({ message: "Erro durante o registro do usuário." });
    }
  }
  static async login(req, res) {
    const email = req.body.email;
    const password = req.body.password;

    switch (true) {
      case !email:
        res.status(422).json({ message: "O e-mail é obrigatório!" });
        return;
      case !password:
        res.status(422).json({ message: "A senha é obrigatória!" });
        return;
      default:
        break;
    }

    const user = await User.findOne({ where: { email: email } });
    if (!user) {
      return res
        .status(422)
        .json({ message: "Não há usuário cadastrado com este e-mail!" });
    }

    const checkPassword = await bcrypt.compare(password, user.password);

    if (!checkPassword) {
      return res.status(422).json({ message: "Senha inválida" });
    }

    await CreateUserToken(user, req, res);
  }
}
