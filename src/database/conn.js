import { Sequelize } from "sequelize";

const sequelize = new Sequelize("projet_estudo", "root", "", {
  host: "localhost",
  dialect: "mysql",
});

sequelize
  .authenticate()
  .then(() => {
    console.log("Conectado ao banco de dados");
  })
  .catch((error) => {
    console.error("Não foi possível conectar ao banco de dados:", error);
  });

export default sequelize;
