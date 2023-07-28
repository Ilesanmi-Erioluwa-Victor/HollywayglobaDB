import express from 'express';
import {
  createUser,
  getUser,
  loginUser,
  updateUser,
} from './services/user.auth.service';
import {
  AuthMiddleWare,
  isUserVerified,
} from '../../middlewares/auth/authToken';

const route = express.Router();
route.post('/signup', createUser);
route.post('/login', loginUser);

route.get('/:id', AuthMiddleWare, isUserVerified, getUser);
route.put('/updateProfile/:id', AuthMiddleWare, isUserVerified, updateUser);
export default route;
