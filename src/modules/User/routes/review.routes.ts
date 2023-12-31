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
  '/:id/review/:reviewId',
  validateUserIdParam,
  validateReviewIdParam,
  getReview
);

route.put(
  '/:id/review/:reviewId',
  validateUserIdParam,
  validateReviewIdParam,
  validateNewReviewInput,
  editReview
);

route.get('/:id/reviews', validateUserIdParam, getReviews);

route.delete(
  '/:id/review/:reviewId',
  validateUserIdParam,
  validateReviewIdParam,
  deleteReview
);

export default route;
