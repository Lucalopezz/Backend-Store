import express from 'express';

import ProductsRoutes from './routes/ProductsRoutes.js'
import UserRoutes from './routes/UserRoutes.js'
import sequelize from './database/conn.js';
import Associations from './models/Associations.js';
Associations();

//sequelize.sync()


const app = express();

app.use(express.json());


app.use("/users", UserRoutes)
app.use("/products", ProductsRoutes)


export default app;