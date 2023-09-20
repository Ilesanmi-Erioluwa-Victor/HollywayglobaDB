import express from 'express';

import {
  user,
  // deleteuser,
  updatepassword,
  updateuser,
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

import {
  validateUserIdParam,
  validatePasswordInput,
} from '../../../middlewares/validationMiddlware';

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

// route.delete('/:id', validateUserIdParam, deleteuser);

route.put(
  '/:id/updateProfile',
  validateUserIdParam,
  validatePasswordInput,
  updateuser
);

// route.post(
//   '/:id/uploadImage',
//   // Token,
//   profileImage.single('image'),
//   profileImageResize,
//   // VerifiedUser,
//   uploadProfile
// );

route.put(
  '/:id/password',
  validateUserIdParam,
  validatePasswordInput,
  updatepassword
);

export default route;
