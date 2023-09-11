import express from 'express';

import { Auth } from '../../../middlewares/auth';

const { Token, VerifiedUser } = Auth;

import { createReview, getReview, editReview } from '../services/user.review.service';


const route = express.Router();

route.post(
  '/user/:id/product/:productId/review',
  Token,
  VerifiedUser,
  createReview
);

route.get('/user/:id/product/:productId/review/:reviewId', Token, VerifiedUser, getReview);

route.put(
  '/user/:id/product/:productId/review/:reviewId',
  Token,
  VerifiedUser,
editReview
);

export default route;
