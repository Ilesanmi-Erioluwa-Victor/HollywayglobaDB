import express from 'express';

import { Auth } from '../../../middlewares/auth';

import {
  addToWishlist,
  decreaseCartItems,
  incrementCartItems,
} from '../services/user.cart.service';

const { Token, VerifiedUser } = Auth;

const route = express.Router();

route.post('/:id/product/add-to-wishlist', Token, VerifiedUser, addToWishlist);

route.put('/:id/product/increaseCart', Token, VerifiedUser, incrementCartItems);

route.put('/:id/product/decreaseCart', Token, VerifiedUser, decreaseCartItems);
