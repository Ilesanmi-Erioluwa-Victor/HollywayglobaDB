import { RequestHandler, NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { throwError } from '../../../middlewares/error';

import { Utils } from '../../../helper/utils';

import { CustomRequest } from '../../../interfaces/custom';

const { catchAsync, ValidateMongoDbId } = Utils;

import { reviewQueries } from './../models/user.review.model';

const { createReviewM } = reviewQueries;

export const createReview: RequestHandler = catchAsync(
  async (req: CustomRequest, res: Response, next: NextFunction) => {
    const { id, productId } = req.params;

    ValidateMongoDbId(id);

    ValidateMongoDbId(productId);

    if (!id) throwError('No user found', StatusCodes.NOT_FOUND);

    if (!productId) throwError('No product found', StatusCodes.NOT_FOUND);

    const { text, rating } = req.body;
    try {
      const review = await createReviewM(req.body, id, productId);
      res.json({
        status: 'success',
        message : "ok",
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
