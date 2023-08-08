import express from 'express';
import { AuthMiddleWare, adminRole } from '../../middlewares/auth/authToken';
import { createProduct } from './services/product.service';
import { getProductsAdmin } from './services/admin.auth.service';

const route = express.Router();
route.post('/admin/:id/product', AuthMiddleWare, adminRole, createProduct);
route.get('/admin/:id/products', AuthMiddleWare, adminRole, getProductsAdmin);
export default route;
