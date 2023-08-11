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
  createAddress,
  editAddress,
} from './services/user.auth.service';
import {
  AuthMiddleWare,
  isUserVerified,
} from '../../middlewares/auth/authToken';
// import { upload } from '../../helper/utils';
import {
  profileImage,
  profileImageResize,
} from '../../middlewares/image/resizeImage';
const route = express.Router();

    /**
     * @swagger
     * /api/products:
     *   get:
     *     summary: Get a list of products
     *     responses:
     *       200:
     *         description: A list of products
     */
route.post('/signup', createUser);
route.post('/login', loginUser);
route.post(
  '/:id/address/create',
  AuthMiddleWare,
  isUserVerified,
  createAddress
);
route.put('/:id/address/edit', AuthMiddleWare, isUserVerified, editAddress);

route.post('/forgetPassword', forgetPasswordToken);
route.put('/resetPassword/:token', resetPassword);
route.get('/:id', AuthMiddleWare, isUserVerified, getUser);
route.put('/updateProfile/:id', AuthMiddleWare, isUserVerified, updateUser);
route.post(
  '/:id/uploadImage',
  AuthMiddleWare,
  profileImage.single('image'),
  profileImageResize,
  isUserVerified,
  uploadProfile
);
route.put('/password/:id', AuthMiddleWare, isUserVerified, updatePassword);
route.put('/:id/verify_account/:token', accountVerification);
export default route;
