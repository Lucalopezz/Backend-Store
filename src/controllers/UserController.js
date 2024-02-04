import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

import User from "../models/Users.js";
import CreateUserToken from "../utils/CreateUserToken.js";
import getToken from "../utils/GetToken.js";
import getUserByToken from "../utils/GetUserByToken.js";

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
  static async getCurrentUserFromToken(req, res) {
    let currentUser;
    if (req.headers.authorization) {
      const token = getToken(req);
      const decoded = jwt.verify(token, "secret");
      currentUser = await User.findByPk(decoded.id);

      currentUser.password = undefined;
    } else {
      currentUser = null;
    }
    res.status(200).send(currentUser);
  }
  static async addUserPhoto(req, res) {
    // can update the photo too
    const token = getToken(req);

    const user = await getUserByToken(token);

    const image = req.file;
    if (!image) {
      res.status(422).json({ message: "Selecione uma imagem" });
    }
    user.image = image.filename;

    try {
      await user.save();
      res
        .status(200)
        .json({ message: "Imagem do usuário atualizada com sucesso." });
    } catch (error) {
      res.status(500).json({ message: "Erro no servidor" });
      console.log(error);
      return;
    }
  }
  static async editUser(req, res) {
    const token = getToken(req);
    const id = req.params.id;
    const userEdit = await getUserByToken(token);
    const {
      username,
      email,
      firstName,
      lastName,
      oldPassword,
      newPassword,
      confirmpassword,
    } = req.body;

    if (id != userEdit.id) {
      res
        .status(422)
        .json({ message: "Erro no servidor, tente novamente mais tarde!" });
      return;
    }

    switch (true) {
      case !username:
        res.status(422).json({ message: "O nome é obrigatório!" });
        return;

      case !email:
        res.status(422).json({ message: "O e-mail é obrigatório!" });
        return;

      case !firstName:
        res.status(422).json({ message: "O telefone é obrigatório!" });
        return;
      case !lastName:
        res.status(422).json({ message: "O telefone é obrigatório!" });
        return;
      case !oldPassword:
        res.status(422).json({ message: "A senha é obrigatória!" });
        return;

      case newPassword !== confirmpassword:
        res
          .status(422)
          .json({ message: "A confirmação e a senha são diferentes" });
        return;
      default:
        break;
    }

    const checkPassword = await bcrypt.compare(oldPassword, userEdit.password); // the old pass is required for the edit
    if (!checkPassword) {
      return res.status(422).json({ message: "Senha inválida" });
    }

    if (newPassword) {
      // but if newPass exist, the camp confirmpass is required
      const salt = await bcrypt.genSalt(12); // the new pass is for update the pass
      const reqPassword = newPassword;
      const passwordHash = await bcrypt.hash(reqPassword, salt);

      userEdit.password = passwordHash;
    }

    userEdit.username = username;
    userEdit.email = email;
    userEdit.firstName = firstName;
    userEdit.lastName = lastName;

    try {
      await userEdit.save();
      res
        .status(200)
        .json({ message: "Perfil do usuário atualizado com sucesso." });
    } catch (error) {
      res.status(500).json({ message: "Erro no servidor" });
      console.log(error);
      return;
    }
  }
}
