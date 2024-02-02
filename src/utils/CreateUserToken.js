import jwt from "jsonwebtoken";

export default async function (user, req, res) {
  const token = jwt.sign(
    {
      name: user.username,
      id: user.id,
    },
    "secret"
  );

  res.status(200).json({
    message: "Você está logado!",
    token: token,
    userId: user.id,
  });
}
