import { RequestHandler, NextFunction, Request, Response } from 'express';

import { StatusCodes } from 'http-status-codes';

import { userQuery } from '../models/user.model';

const { findUserMId } = userQuery;

import { throwError } from '../../../middlewares/error';

import { Utils } from '../../../helper/utils';

import { BadRequestError, NotFoundError } from '../../../errors/customError';

const { catchAsync, ValidateMongoDbId } = Utils;

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
    const { id } = req.params;
    ValidateMongoDbId(id);

    if (!id) throwError('Invalid ID', StatusCodes.BAD_REQUEST);
    try {
      const reviews = await getReviewsM(id);

      res.json({
        length: reviews.length,
        status: 'success',
        message: 'ok',
        data: reviews,
      });
    } catch (error: any) {
      if (!error.statusCode) {
        error.statusCode = 500;
      }
      next(error);
    }
  }
);

export const deleteReview: RequestHandler = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id, reviewId } = req.params;

    ValidateMongoDbId(id);

    ValidateMongoDbId(reviewId);

    if (!id) throwError('No user found', StatusCodes.NOT_FOUND);

    if (!reviewId) throwError('No review found', StatusCodes.NOT_FOUND);

    try {
      const review = await deleteReviewIdM(reviewId);
      res.json({
        status: 'success',
        message: 'review deleted',
      });
    } catch (error: any) {
      if (!error.statusCode) {
        error.statusCode = 500;
      }
      next(error);
    }
  }
);
