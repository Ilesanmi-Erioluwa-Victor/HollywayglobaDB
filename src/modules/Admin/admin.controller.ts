import express from 'express';
import { AuthMiddleWare, adminRole } from '../../middlewares/auth/authToken';
import {
  accountVerificationAdmin,
  adminSignup,
  loginAdmin,
  getUsersAdmin,
} from './services/admin.auth.service';
import {
  createCategory,
  editCategory,
  deleteCategory,
  findCategory,
  getCategories,
} from './services/admin.category.service';

const route = express.Router();
route.post('/admin_signup', adminSignup);
route.post('/admin_login', loginAdmin);
route.put('/:id/verify_account/:token', accountVerificationAdmin);
route.get('/:id/users', AuthMiddleWare, adminRole, getUsersAdmin);

route.post('/:id/category', AuthMiddleWare, adminRole, createCategory);
route.get('/:id/category/:categoryId', AuthMiddleWare, adminRole, findCategory);
route.put('/:id/category/:categoryId', AuthMiddleWare, adminRole, editCategory);
route.get('/:id/category/', AuthMiddleWare, adminRole, getCategories);
route.delete(
  '/:id/category/:categoryId',
  AuthMiddleWare,
  adminRole,
  deleteCategory
);

export default route;
