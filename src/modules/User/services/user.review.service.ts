import { RequestHandler, NextFunction, Request, Response } from 'express';

import { StatusCodes } from 'http-status-codes';

import { userQuery } from '../models/user.model';

const { findUserMId } = userQuery;

import { throwError } from '../../../middlewares/error';

import { Utils } from '../../../helper/utils';


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
    const { id, productId } = req.params;

    ValidateMongoDbId(id);

    ValidateMongoDbId(productId);

    if (!id) throwError('No user found', StatusCodes.NOT_FOUND);

    const { text, rating } = req.body;
    try {
      const review = await createReviewM(req.body, id, productId);
      res.json({
        status: 'success',
        message: 'ok',
        data: review,
      });
    } catch (error: any) {
      if (!error.statusCode) {
        error.statusCode = 500;
      }
      next(error);
    }
  }
);

export const getReview: RequestHandler = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id, productId, reviewId } = req.params;

    ValidateMongoDbId(id);

    ValidateMongoDbId(productId);

    if (!id) throwError('No user found', StatusCodes.NOT_FOUND);

    if (!productId) throwError('No product found', StatusCodes.NOT_FOUND);

    if (!reviewId) throwError('No review found', StatusCodes.NOT_FOUND);

    try {
      const review = await getReviewWithUserDetailsM(reviewId);
      res.json({
        status: 'success',
        message: 'ok',
        data: review,
      });
    } catch (error: any) {
      if (!error.statusCode) {
        error.statusCode = 500;
      }
      next(error);
    }
  }
);

export const editReview = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id, productId, reviewId } = req.params;

    ValidateMongoDbId(id);
    ValidateMongoDbId(productId);
    ValidateMongoDbId(reviewId);
    if (!id) throwError('Invalid ID', StatusCodes.NOT_FOUND);

    if (!productId) throwError('Invalid ID', StatusCodes.NOT_FOUND);

    if (!reviewId) throwError('Invalid ID', StatusCodes.NOT_FOUND);

    try {
      const existingReview = await findReviewIdM(reviewId);

      if (!existingReview) throwError('No Review found', StatusCodes.NOT_FOUND);

      const updatedReview = await updateReviewM(reviewId as string, req.body);

      if (!updatedReview)
        throwError(
          'Sorry, something went wrong, try again',
          StatusCodes.BAD_REQUEST
        );

      res.json({
        status: 'success',
        message: 'ok',
        data: updatedReview,
      });
    } catch (error: any) {
      if (!error.statusCode) {
        error.statusCode = 500;
      }
      next(error);
    }
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
