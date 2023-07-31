import express from 'express';
import {
  createUser,
  getUser,
  loginUser,
  updatePassword,
  updateUser,
  accountVerification,
  forgetPasswordToken,
  resetPassword,
  uploadProfile,
} from './services/user.auth.service';
import {
  AuthMiddleWare,
  isUserVerified,
} from '../../middlewares/auth/authToken';

const route = express.Router();
route.post('/signup', createUser);
route.post('/login', loginUser);

route.post('/forgetPassword', forgetPasswordToken);
route.put('/resetPassword/:token', resetPassword);
route.get('/:id', AuthMiddleWare, isUserVerified, getUser);
route.put('/updateProfile/:id', AuthMiddleWare, isUserVerified, updateUser);
route.post('/uploadImage/:id', AuthMiddleWare, isUserVerified, uploadProfile);
route.put('/password/:id', AuthMiddleWare, isUserVerified, updatePassword);
route.put('/:id/verify_account/:token', accountVerification);
export default route;
