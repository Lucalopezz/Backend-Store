import jwt from "jsonwebtoken";

import getToken from "./GetToken.js";
import getUserByToken from "./GetUserByToken.js";

const checkAdmin = async (req, res, next) => {
  const token = getToken(req);
  if (!token) {
    return res.status(401).json({ message: "Acesso Negado!" });
  }
  const user = await getUserByToken(token);
  if (!user.isAdmin ) {
    return res.status(401).json({ message: "Acesso Negado!" });
  }
  try {
    const verified = jwt.verify(token, "secret");
    req.user = verified;
    next();
  } catch (error) {
    return res.status(400).json({ message: "Token inválido!" });
  }
};

export default checkAdmin;
