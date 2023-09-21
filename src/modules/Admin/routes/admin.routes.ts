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
} from '../services/admin.product.service';
import {
  validateAdminIdParam,
  validateProductIdParam,
} from '../../../middlewares/validationMiddlware';
import { getUsersAdmin } from '../services/admin.users.service';

const route = express.Router();

route.get('/:adminId/users', validateAdminIdParam, getUsersAdmin);

route.get('/:adminId/products', validateAdminIdParam, getProductsAdmin);

route.post(
  '/:adminId/product',
  validateAdminIdParam,
  upload.array('images', 5),
  createProduct
);
route.get('/:adminId/products', validateAdminIdParam, getProductsAdmin);

route.get(
  '/:adminId/product/:productId',
  validateAdminIdParam,
  validateProductIdParam,
  getProductAdmin
);

route.delete(
  '/:adminId/product/:productId',
  validateAdminIdParam,
  validateProductIdParam,
  deleteProductAdmin
);

route.put(
  '/:adminId/product/:productId',
  validateAdminIdParam,
  validateProductIdParam,
  editProductAdmin
);

route.post(
  '/:adminId/product/:productId',
  validateAdminIdParam,
  upload.array('images', 5),
  validateProductIdParam,
  editProductImagesAdmin
);

route.post('/:adminId/category', validateAdminIdParam, createCategory);

route.get(
  '/:adminId/category/:categoryId',
  validateAdminIdParam
  // findCategory
);

route.put(
  '/:adminId/category/:categoryId',
  validateAdminIdParam
  // editCategory
);

route.get('/category', getCategories);

route.delete(
  '/:adminId/category/:categoryId',
  validateAdminIdParam
  // deleteCategory
);

export default route;
