import jwt from "jsonwebtoken";

import User from "../models/Users.js";

export default async function getUserByToken(token) {
  if (!token) return res.status(401).json({ error: "Acesso negado!" });

  // find user
  const decoded = jwt.verify(token, "secret");

  const userId = decoded.id;

  const user = await User.findByPk(userId);

  return user;
}
