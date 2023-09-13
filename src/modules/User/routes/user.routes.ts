import express from 'express';

import { customValidator } from 'middlewares/validators/Validator';

const { createUserValidation, loginUserValidation, validate } = customValidator;

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
} from '../services/user.auth.service';

import {
  createAddress,
  editAddress,
  getAddresses,
  deleteAddresses,
} from '../services/user.address.service';

import { Auth } from '../../../middlewares/auth';

import {
  profileImage,
  profileImageResize,
} from '../../../middlewares/image/resizeImage';

const { Token, VerifiedUser } = Auth;

const route = express.Router();

route.post('/signup', createUserValidation, validate, createUser);

route.post('/login', loginUser);

route.post('/:id/address', Token, VerifiedUser, createAddress);

route.put('/:id/address/:addressId', Token, VerifiedUser, editAddress);

route.get('/:id/address', Token, VerifiedUser, getAddresses);

route.delete('/:id/address/:addressId', Token, VerifiedUser, deleteAddresses);

route.post('/forgetPassword', forgetPasswordToken);

route.put('/resetPassword/:token', resetPassword);

route.get('/:id', Token, VerifiedUser, getUser);

route.put('/updateProfile/:id', Token, VerifiedUser, updateUser);

route.post(
  '/:id/uploadImage',
  Token,
  profileImage.single('image'),
  profileImageResize,
  VerifiedUser,
  uploadProfile
);

route.put('/password/:id', Token, VerifiedUser, updatePassword);

route.put('/:id/verify_account/:token', accountVerification);

export default route;
