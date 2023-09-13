import express from 'express';

import { Auth } from '../../../middlewares/auth';

import {
  createCart,
  decreaseCartItems,
  incrementCartItems,
} from '../services/user.cart.service';

const { Token, VerifiedUser } = Auth;

const route = express.Router();

route.post('/add-to-cart/:id', Token, VerifiedUser, createCart);

route.put('/increaseCart/:id', Token, VerifiedUser, incrementCartItems);

route.put('/decreaseCart/:id', Token, VerifiedUser, decreaseCartItems);
