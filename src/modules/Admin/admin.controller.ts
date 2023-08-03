import express from 'express';
import { AuthMiddleWare, adminRole } from '../../middlewares/auth/authToken';
import { accountVerificationAdmin, adminSignup } from './services/admin.auth.service';

const route = express.Router();
route.post('/admin_signup', adminSignup);
route.put('/:id/verify_account/:token', accountVerificationAdmin);

export default route;
