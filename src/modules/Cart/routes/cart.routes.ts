import express from 'express';

import { validateUserIdParam } from '../../../middlewares/validationMiddlware';

import {
  createCart,
  //   decreaseCartItems,
  getCart,
  //   incrementCartItems,
} from '../services/user.cart.service';

// const { Token, VerifiedUser } = Auth;

const route = express.Router();

route.post(
  '/add/:id',
  // Token, VerifiedUser,
  createCart
);

route.get('/:id', validateUserIdParam, getCart);

// route.put('/increaseCart/:id', Token, VerifiedUser, incrementCartItems);

// route.put('/decreaseCart/:id', Token, VerifiedUser, decreaseCartItems);
export default route;
