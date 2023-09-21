import { RequestHandler, NextFunction, Request, Response } from 'express';

import { Utils } from '../../../helper/utils';

import { NotFoundError } from '../../../errors/customError';

const { catchAsync } = Utils;

import { reviewQuery } from './../models/user.review.model';

const {
  createReviewM,
  getReviewWithUserDetailsM,
  updateReviewM,
  findReviewIdM,
  getReviewsM,
  deleteReviewIdM,
} = reviewQuery;

export const createReview: RequestHandler = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const review = await createReviewM(
      req.body,
      req.params.id,
      req.params.productId
    );
    res.json({
      status: 'success',
      message: 'ok',
    });
  }
);

export const getReview: RequestHandler = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const review = await getReviewWithUserDetailsM(req.params.reviewId);

    res.json({
      status: 'success',
      message: 'ok',
      data: review,
    });
  }
);

export const editReview = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const existingReview = await findReviewIdM(req.params.reviewId);

    if (!existingReview) throw new NotFoundError('no review found ...');

    const updatedReview = await updateReviewM(req.params.reviewId, req.body);

    res.json({
      status: 'success',
      message: 'ok',
    });
  }
);

export const getReviews = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const reviews = await getReviewsM(req.params.id);

    res.json({
      length: reviews.length,
      status: 'success',
      message: 'ok',
      data: reviews,
    });
  }
);

export const deleteReview: RequestHandler = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const review = await deleteReviewIdM(req.params.reviewId);
    res.json({
      status: 'success',
      message: 'review deleted',
    });
  }
);
