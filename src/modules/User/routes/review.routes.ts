import express from 'express';

import {
  validateUserIdParam,
  validateNewReviewInput,
  validateProductIdParam,
  validateReviewIdParam,
} from '../../../middlewares/validationMiddlware';

import {
  createReview,
  getReview,
  editReview,
  getReviews,
  deleteReview,
} from '../services/user.review.service';

const route = express.Router();

route.post(
  '/:id/product/:productId/review',
  validateUserIdParam,
  validateProductIdParam,
  validateNewReviewInput,
  createReview
);

route.get(
  '/:id/product/:productId/review/:reviewId',
  validateUserIdParam,
  validateProductIdParam,
  validateReviewIdParam,
  getReview
);

route.put(
  '/:id/product/:productId/review/:reviewId',
  // Token,
  // VerifiedUser,
  editReview
);

route.get(
  '/:id/reviews',
  // Token,
  // VerifiedUser,
  getReviews
);

route.delete(
  '/:id/review/:reviewId',
  // Token, VerifiedUser,
  deleteReview
);

export default route;
