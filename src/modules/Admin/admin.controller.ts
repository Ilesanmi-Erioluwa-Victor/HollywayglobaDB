import express from 'express';
import { AuthMiddleWare, adminRole } from '../../middlewares/auth/authToken';
import {
  accountVerificationAdmin,
  adminSignup,
  loginAdmin,
  getUsersAdmin
} from './services/admin.auth.service';
import {
  createCategory,
  editCategory,
  deleteCategory,
} from './services/admin.category.service';

const route = express.Router();
route.post('/admin_signup', adminSignup);
route.post('/admin_login', loginAdmin);
route.post('/:id/category', AuthMiddleWare, adminRole, createCategory);
route.post('/:id/category', AuthMiddleWare, adminRole, createCategory);
route.get('/:id/category/:categoryId', AuthMiddleWare, adminRole, editCategory);
route.delete('/:id/category/:categoryId', AuthMiddleWare, adminRole, deleteCategory);
route.get('/:id/users', AuthMiddleWare, adminRole, getUsersAdmin);
route.put('/:id/verify_account/:token', accountVerificationAdmin);

export default route;
