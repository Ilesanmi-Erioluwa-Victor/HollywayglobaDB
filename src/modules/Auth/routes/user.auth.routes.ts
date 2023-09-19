import { Router } from 'express';
import { register, login } from '../services/user.auth.service';
import {
  validateRegisterInput,
  validateLoginInput,
} from '../../../middlewares/validationMiddlware';

const route = Router();

route.post('/register', validateRegisterInput, register);
route.post('/login', validateLoginInput, login);
// route.get('/logout', logout);
export default route;