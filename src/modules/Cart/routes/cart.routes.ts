import express from 'express';

import {
  validateUserIdParam,
  validateProductIdParam,
} from '../../../middlewares/validationMiddlware';

import {
  createCart,
  decreaseCartItems,
  getCart,
  //   incrementCartItems,
} from '../services/user.cart.service';

// const { Token, VerifiedUser } = Auth;

const route = express.Router();

route.post('/add/:id', validateUserIdParam, createCart);

route.get('/:id', validateUserIdParam, getCart);

// route.put('/increaseCart/:id', Token, VerifiedUser, incrementCartItems);

route.put(
  '/decreaseCart/:productId',
  validateProductIdParam,
  decreaseCartItems
);
export default route;
