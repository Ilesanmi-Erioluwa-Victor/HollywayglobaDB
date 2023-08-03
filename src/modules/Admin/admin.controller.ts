import express from 'express';
import { AuthMiddleWare, adminRole } from '../../middlewares/auth/authToken';
import {
  accountVerificationAdmin,
  adminSignup,
  loginAdmin,
  getUsersAdmin,
} from './services/admin.auth.service';

const route = express.Router();
route.post('/admin_signup', adminSignup);
route.post('/admin_login', loginAdmin);
route.get('/admin/:id/users', AuthMiddleWare, adminRole, getUsersAdmin);
route.put('/:id/verify_account/:token', accountVerificationAdmin);

export default route;
