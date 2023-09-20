import express from 'express';

import {
  user,
  deleteuser,
  // updatePassword,
  // updateUser,
  // uploadProfile,
} from '../services/user.service';

import {
  createAddress,
  editAddress,
  getAddresses,
  deleteAddresses,
} from '../services/user.address.service';

import {
  profileImage,
  profileImageResize,
} from '../../../middlewares/image/resizeImage';

import { validateUserIdParam } from '../../../middlewares/validationMiddlware';

const route = express.Router();

route.post(
  '/:id/address',
  // Token, VerifiedUser,
  createAddress
);

route.put(
  '/:id/address/:addressId',
  // Token, VerifiedUser,
  editAddress
);

route.get(
  '/:id/address',
  // Token, VerifiedUser,
  getAddresses
);

route.delete(
  '/:id/address/:addressId',
  // Token, VerifiedUser,
  deleteAddresses
);

route.get('/:id', validateUserIdParam, user);

route.delete('/:id', validateUserIdParam, deleteuser);

// route.put(
//   '/updateProfile/:id',
//   // Token, VerifiedUser,
//   updateUser
// );

// route.post(
//   '/:id/uploadImage',
//   // Token,
//   profileImage.single('image'),
//   profileImageResize,
//   // VerifiedUser,
//   uploadProfile
// );

// route.put(
//   '/password/:id',
//   // Token, VerifiedUser,
//   updatePassword
// );

export default route;
