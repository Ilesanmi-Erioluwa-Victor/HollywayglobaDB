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
} from '../services/user.auth.service';

import {
  addToWishlist,
  decreaseCartItems,
  incrementCartItems,
} from '../services/user.cart.service';

import {
  AuthMiddleWare,
  isUserVerified,
} from '../../../middlewares/auth/authToken';

import {
  profileImage,
  profileImageResize,
} from '../../../middlewares/image/resizeImage';

const route = express.Router();

route.post('/signup', createUser);

route.post('/login', loginUser);

route.post(
  '/:id/address/create',
  AuthMiddleWare,
  isUserVerified,
  createAddress
);

route.post(
  '/:id/product/add-to-wishlist',
  AuthMiddleWare,
  isUserVerified,
  addToWishlist
);

route.put(
  '/:id/product/increaseCart',
  AuthMiddleWare,
  isUserVerified,
  incrementCartItems
);

route.put(
  '/:id/product/decreaseCart',
  AuthMiddleWare,
  isUserVerified,
  decreaseCartItems
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
