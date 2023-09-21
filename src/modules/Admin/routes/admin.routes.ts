import express from 'express';
import multer from 'multer';

const storage = multer.memoryStorage();
const upload = multer({ storage });

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
} from '../services/product.service';
import { validateAdminIdParam } from 'middlewares/validationMiddlware';

// const { Token, Admin } = Auth;

const route = express.Router();

route.get(
  '/:adminId/users'
  // Token, Admin,

  // getUsersAdmin
);

// route.get('/:id/products', Token, Admin, getProductsAdmin);

route.post(
  '/:adminId/product',
  validateAdminIdParam,
  upload.array('images', 5),
  createProduct
);
route.get(
  '/:adminId/products',
  // Token, Admin,
  getProductsAdmin
);

route.get(
  '/:adminId/product/:productId',
  // Token, Admin,
  getProductAdmin
);

route.delete(
  '/:adminId/product/:productId',
  // Token, Admin,
  deleteProductAdmin
);

route.put(
  '/:adminId/product/:productId',
  // Token, Admin,
  editProductAdmin
);

route.post(
  '/:adminId/product/:productId',
  // Token,
  upload.array('images', 5),
  // Admin,
  editProductImagesAdmin
);

route.post(
  '/:adminId/category'
  // Token, Admin,
  // createCategory
);

route.get(
  '/:adminId/category/:categoryId'
  // Token, Admin,
  // findCategory
);

route.put(
  '/:adminId/category/:categoryId'
  // Token, Admin,
  // editCategory
);

route.get(
  '/category'
  // Token,
  // getCategories
);

route.delete(
  '/:adminId/category/:categoryId'
  // Token, Admin,
  // deleteCategory
);

export default route;
