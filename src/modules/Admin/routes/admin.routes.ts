import express from 'express';
import multer from 'multer';

import { Auth } from '../../../middlewares/auth';

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

const { Token, Admin } = Auth;

const route = express.Router();

route.post('/sign_up', adminSignup);

route.post('/login', loginAdmin);

route.put('/:id/verify_account/:token', accountVerificationAdmin);

route.get('/:id/users', Token, Admin, getUsersAdmin);

// route.get('/:id/products', Token, Admin, getProductsAdmin);

route.post('/:id/category', Token, Admin, createCategory);

route.get('/:id/category/:categoryId', Token, Admin, findCategory);

route.put('/:id/category/:categoryId', Token, Admin, editCategory);

route.get('/categories', Token, getCategories);

route.delete('/:id/category/:categoryId', Token, Admin, deleteCategory);

route.post(
  '/admin/:id/product',
  Token,
  upload.array('images', 5),
  Admin,
  createProduct
);
route.get('/admin/:id/products', Token, Admin, getProductsAdmin);

route.get('/admin/:id/product/:productId', Token, Admin, getProductAdmin);

route.delete('/admin/:id/product/:productId', Token, Admin, deleteProductAdmin);

route.put('/admin/:id/product/:productId', Token, Admin, editProductAdmin);

route.post(
  '/admin/:id/product/:productId',
  Token,
  upload.array('images', 5),
  Admin,
  editProductImagesAdmin
);



export default route;
