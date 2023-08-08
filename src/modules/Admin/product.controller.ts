import express from 'express';
import { AuthMiddleWare, adminRole } from '../../middlewares/auth/authToken';
import { createProduct, deleteProductAdmin, getProductAdmin, getProductsAdmin } from './services/product.service';

const route = express.Router();
route.post('/admin/:id/product', AuthMiddleWare, adminRole, createProduct);
route.get('/admin/:id/products', AuthMiddleWare, adminRole, getProductsAdmin);
route.get('/admin/:id/product/:productId', AuthMiddleWare, adminRole, getProductAdmin);
route.delete(
  '/admin/:id/product/:productId',
  AuthMiddleWare,
  adminRole,
  deleteProductAdmin
);
export default route;
