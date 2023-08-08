import express from 'express';
import { AuthMiddleWare, adminRole } from '../../middlewares/auth/authToken';
import { createProduct, getProductAdmin, getProductsAdmin } from './services/product.service';

const route = express.Router();
route.post('/admin/:id/product', AuthMiddleWare, adminRole, createProduct);
route.get('/admin/:id/products', AuthMiddleWare, adminRole, getProductsAdmin);
route.get('/admin/:id/products', AuthMiddleWare, adminRole, getProductAdmin);
export default route;
