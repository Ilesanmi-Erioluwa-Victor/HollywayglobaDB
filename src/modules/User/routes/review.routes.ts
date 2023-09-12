import express from 'express';

import { Auth } from '../../../middlewares/auth';

const { Token, VerifiedUser } = Auth;

import {
  createReview,
  getReview,
  editReview,
  getReviews,
} from '../services/user.review.service';

const route = express.Router();

route.post(
  '/:id/product/:productId/review',
  Token,
  VerifiedUser,
  createReview
);

route.get(
  '/:id/product/:productId/review/:reviewId',
  Token,
  VerifiedUser,
  getReview
);

route.put(
  '/:id/product/:productId/review/:reviewId',
  Token,
  VerifiedUser,
  editReview
);

route.get(
  '/:id/reviews',
  Token,
  VerifiedUser,
  getReviews
);

route.delete('/:id/review/:reviewId', Token, VerifiedUser, getReviews);

export default route;
