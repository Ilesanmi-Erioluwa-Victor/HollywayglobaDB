import express from 'express';

import { Auth } from '../../../middlewares/auth';
import { createReview } from '../services/user.review.service';

const { Token, VerifiedUser } = Auth;

const route = express.Router();

route.post(
  '/user/:id/product/:productId',
  Token,
  VerifiedUser,
  createReview
);

export default route;
