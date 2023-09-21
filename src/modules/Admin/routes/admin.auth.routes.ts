import express from 'express';

const route = express.Router();

import { Auth } from '../../../middlewares/auth';

import {
  validateEmailInput,
  validatePasswordInput,
  validateAdminSignupInput,
} from '../../../middlewares/validationMiddlware';

const { authenticateUser } = Auth;

import {
  accountVerificationAdmin,
  adminSignup,
  loginAdmin,
  logoutAdmin,
} from '../services/admin.auth.service';

route.post('/signup', validateAdminSignupInput, adminSignup);

route.post('/login', loginAdmin);

route.post('/logout', authenticateUser, logoutAdmin);

// route.post('/forgetPassword', validateEmailInput, forgetPasswordToken);

route.put('/:adminId/verify_account/:token', accountVerificationAdmin);

// route.put('/resetPassword/:token', validatePasswordInput, resetPassword);

export default route;
