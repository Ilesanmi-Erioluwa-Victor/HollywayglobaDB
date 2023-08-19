import express from 'express';
import multer from 'multer';
import { AuthMiddleWare, adminRole } from '../../../middlewares/auth';

const storage = multer.memoryStorage();
const upload = multer({ storage });

import {
  accountVerificationAdmin,
  adminSignup,
  loginAdmin,
  getUsersAdmin,
} from '../services/admin.auth.service';

import {
  createCategory,
  editCategory,
  deleteCategory,
  findCategory,
  getCategories,
} from '../services/admin.category.service';

import {
  createProduct,
  deleteProductAdmin,
  getProductAdmin,
  getProductsAdmin,
  editProductAdmin,
  editProductImagesAdmin,
  TopTenProducts,
} from '../services/product.service';

const route = express.Router();

route.post('/sign_up', adminSignup);

route.post('/login', loginAdmin);

route.put('/:id/verify_account/:token', accountVerificationAdmin);

route.get('/:id/users', AuthMiddleWare, adminRole, getUsersAdmin);

// route.get('/:id/products', AuthMiddleWare, adminRole, getProductsAdmin);

route.post('/:id/category', AuthMiddleWare, adminRole, createCategory);

route.get('/:id/category/:categoryId', AuthMiddleWare, adminRole, findCategory);

route.put('/:id/category/:categoryId', AuthMiddleWare, adminRole, editCategory);

route.get('/categories', AuthMiddleWare, getCategories);

route.delete(
  '/:id/category/:categoryId',
  AuthMiddleWare,
  adminRole,
  deleteCategory
);

route.post(
  '/admin/:id/product',
  AuthMiddleWare,
  upload.array('images', 5),
  adminRole,
  createProduct
);
route.get('/admin/:id/products', AuthMiddleWare, adminRole, getProductsAdmin);

route.get(
  '/admin/:id/product/:productId',
  AuthMiddleWare,
  adminRole,
  getProductAdmin
);

route.delete(
  '/admin/:id/product/:productId',
  AuthMiddleWare,
  adminRole,
  deleteProductAdmin
);

route.put(
  '/admin/:id/product/:productId',
  AuthMiddleWare,
  adminRole,
  editProductAdmin
);

route.post(
  '/admin/:id/product/:productId',
  AuthMiddleWare,
  upload.array('images', 5),
  adminRole,
  editProductImagesAdmin
);

route.get('/top-10-cheap-products', TopTenProducts);

export default route;
