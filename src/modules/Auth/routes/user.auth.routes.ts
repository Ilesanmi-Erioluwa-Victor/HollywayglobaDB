import { Router } from 'express';
import {
  register,
  login,
  logout,
  forgetPasswordToken,
  accountVerification
} from '../services/user.auth.service';

import {
  validateRegisterInput,
  validateLoginInput,
  validateforgottenPasswordInput,
} from '../../../middlewares/validationMiddlware';

const route = Router();

route.post('/register', validateRegisterInput, register);

route.post('/login', validateLoginInput, login);

route.get('/logout', logout);

route.post(
  '/forgetPassword',
  validateforgottenPasswordInput,
  forgetPasswordToken
);

route.put('/:id/verify_account/:token', accountVerification);
export default route;
