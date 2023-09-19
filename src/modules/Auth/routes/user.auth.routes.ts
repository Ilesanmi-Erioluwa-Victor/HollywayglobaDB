import { Router } from 'express';
import {
  register,
  login,
  logout,
  forgetPasswordToken,
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
export default route;
