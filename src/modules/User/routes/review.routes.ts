import express from 'express';

import { Auth } from '../../../middlewares/auth';

const { Token, VerifiedUser } = Auth;

import { createReview, getReview } from '../services/user.review.service';


const route = express.Router();

route.post(
  '/user/:id/product/:productId',
  Token,
  VerifiedUser,
  createReview
);

route.get('/user/:id/product/:productId/reviews/:reviewId', Token, VerifiedUser, getReview);

export default route;
