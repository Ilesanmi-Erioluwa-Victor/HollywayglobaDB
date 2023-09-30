import express from 'express';

import {
  user,
  // deleteuser,
  updatepassword,
  updateuser,
  uploadprofile,
} from '../services/user.service';

import {
  createAddress,
  editAddress,
  getAddresses,
  getAddress,
  deleteAddress,
} from '../services/user.address.service';

import {
  profileImage,
  profileImageResize,
} from '../../../middlewares/image/resizeImage';

import {
  validateUserIdParam,
  validatePasswordInput,
  validateNewAddressInput,
  validateAddressIdParam,
  validateNewReviewInput,
} from '../../../middlewares/validationMiddlware';

const route = express.Router();

route.post(
  '/:id/address',
  validateUserIdParam,
  validateNewAddressInput,
  createAddress
);

route.put(
  '/:id/address/:addressId',
  validateUserIdParam,
  validateAddressIdParam,
  editAddress
);

route.get(
  '/:id/address/:addressId',
  validateUserIdParam,
  validateAddressIdParam,
  getAddress
);

route.get('/:id/address', validateUserIdParam, getAddresses);

route.delete(
  '/:id/address/:addressId',
  validateUserIdParam,
  validateAddressIdParam,
  deleteAddress
);

route.get('/:id', validateUserIdParam, user);

// route.delete('/:id', validateUserIdParam, deleteuser);

route.put('/:id/updateProfile', validateUserIdParam, updateuser);

route.post(
  '/:id/uploadImage',
  validateUserIdParam,
  profileImage.single('image'),
  profileImageResize,
  uploadprofile
);

route.put(
  '/:id/password',
  validateUserIdParam,
  validatePasswordInput,
  updatepassword
);

export default route;
