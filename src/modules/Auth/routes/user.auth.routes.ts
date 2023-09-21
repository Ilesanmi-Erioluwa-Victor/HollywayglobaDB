import { Router } from 'express';
import {
  register,
  login,
  logout,
  forgetPasswordToken,
  accountVerification,
  resetPassword,
} from '../services/auth.service';

import {
  validateRegisterInput,
  validateLoginInput,
  validateEmailInput,
  validatePasswordInput,
} from '../../../middlewares/validationMiddlware';

import { Auth } from '../../../middlewares/auth';

const { authenticateUser } = Auth;

const route = Router();

route.post('/register', validateRegisterInput, register);

route.post('/login', validateLoginInput, login);

route.get('/logout', authenticateUser, logout);

route.post('/forgetPassword', validateEmailInput, forgetPasswordToken);

route.put('/:id/verify_account/:token', accountVerification);

route.put('/resetPassword/:token', validatePasswordInput, resetPassword);
export default route;
