import express from 'express';
import { AuthMiddleWare, adminRole } from '../../middlewares/auth/authToken';
import {
  accountVerificationAdmin,
  adminSignup,
  loginAdmin,
  getUsersAdmin,
  createCategory,
} from './services/admin.auth.service';

const route = express.Router();
route.post('/admin_signup', adminSignup);
route.post('/admin_login', loginAdmin);
route.post('/:id/category', AuthMiddleWare, adminRole, createCategory);
route.post('/:id/category/:categoryId', AuthMiddleWare, adminRole, createCategory);
route.get('/:id/users', AuthMiddleWare, adminRole, getUsersAdmin);
route.put('/:id/verify_account/:token', accountVerificationAdmin);

export default route;
