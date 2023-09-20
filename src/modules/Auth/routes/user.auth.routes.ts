import { Router } from 'express';
import {
  register,
  login,
  logout,
  forgetPasswordToken,
  accountVerification,
  resetPassword,
} from '../services/user.auth.service';

import {
  validateRegisterInput,
  validateLoginInput,
  validateforgottenPasswordInput,
  validateresetPasswordInput,
} from '../../../middlewares/validationMiddlware';

import { Auth } from '../../../middlewares/auth';

const { authenticateUser } = Auth;

const route = Router();

route.post('/register', validateRegisterInput, register);

route.post('/login', validateLoginInput, login);

route.get('/logout', authenticateUser, logout);

route.post(
  '/forgetPassword',
  validateforgottenPasswordInput,
  forgetPasswordToken
);

route.put('/:id/verify_account/:token', accountVerification);

route.put('/resetPassword/:token', validateresetPasswordInput, resetPassword);
export default route;
