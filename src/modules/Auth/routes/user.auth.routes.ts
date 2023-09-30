import { Router } from 'express';

import {
  register,
  login,
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

const route = Router();

route.post('/register', validateRegisterInput, register);

route.post('/login', validateLoginInput, login);

route.post('/forgetPassword', validateEmailInput, forgetPasswordToken);

route.put('/:id/verify_account/:token', accountVerification);

route.put('/resetPassword/:token', validatePasswordInput, resetPassword);
export default route;
