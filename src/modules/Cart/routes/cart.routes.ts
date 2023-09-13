import express from 'express';

import { Auth } from '../../../middlewares/auth';

import {
  createCart,
//   decreaseCartItems,
  getCart,
//   incrementCartItems,
} from '../services/user.cart.service';

const { Token, VerifiedUser } = Auth;

const route = express.Router();

route.post('/add/:id', Token, VerifiedUser, createCart);

route.get("/:id", getCart)

// route.put('/increaseCart/:id', Token, VerifiedUser, incrementCartItems);

// route.put('/decreaseCart/:id', Token, VerifiedUser, decreaseCartItems);
export default route
