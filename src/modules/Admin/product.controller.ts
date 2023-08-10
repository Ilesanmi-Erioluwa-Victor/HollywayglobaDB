import express from 'express';
import multer from "multer"
import { AuthMiddleWare, adminRole } from '../../middlewares/auth/authToken';
import {
  createProduct,
  deleteProductAdmin,
  getProductAdmin,
  getProductsAdmin,
  editProductAdmin,
} from './services/product.service';
// import {
//   profileImage,
//   profileImageResize,
// } from '../../middlewares/image/resizeImage';

const storage = multer.memoryStorage();
const upload = multer({ storage });

const route = express.Router();
route.post(
  '/admin/:id/product',
  AuthMiddleWare,
  upload.array('images', 5),
  // profileImageResize,
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
  '/admin/:adminId/product/:productId',
  AuthMiddleWare,
  adminRole,
  editProductAdmin
);
export default route;
