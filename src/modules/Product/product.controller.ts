import express from 'express';
import { AuthMiddleWare, adminRole } from '../../middlewares/auth/authToken';
import { createProduct } from "./services/product.service"

const route = express.Router();
route.post("/:id/admin/products", AuthMiddleWare, adminRole, createProduct)
export default route;
