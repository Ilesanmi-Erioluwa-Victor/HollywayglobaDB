import { RequestHandler, NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { throwError } from '../../../middlewares/error/cacheError';
import {
  catchAsync,
  ValidateMongoDbId,
  generateToken,
} from '../../../helper/utils';
import { CustomRequest } from '../../../interfaces/custom';
import {
  createCategoryM,
  deleteCategoryM,
  editCategoryM,
  findCategoryM,

} from '../models';

export const createCategory: RequestHandler = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    ValidateMongoDbId(id);
    try {
      if (!id)
        next(throwError('No Admin record found', StatusCodes.BAD_REQUEST));
      const category = await createCategoryM(req.body);
      res.json({
        message: 'You have successfully created category.',
      });
    } catch (error: any) {
      if (!error.statusCode) {
        error.statusCode = 500;
      }
      next(error);
    }
  }
);

export const editCategory: RequestHandler = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id, categoryId } = req.params;
    ValidateMongoDbId(id);
    ValidateMongoDbId(categoryId);
    const { name } = req.body;
    if (!name)
      next(
        throwError('Enter name of category to edit', StatusCodes.BAD_REQUEST)
      );
    try {
      if (!id)
        next(throwError('No Admin record found', StatusCodes.BAD_REQUEST));
      if (!categoryId)
        next(throwError('No Category record found', StatusCodes.BAD_REQUEST));

      const category = await editCategoryM(categoryId, name);
      res.json({
        message: 'You have successfully edited this category.',
      });
    } catch (error: any) {
      if (!error.statusCode) {
        error.statusCode = 500;
      }
      next(error);
    }
  }
);

export const deleteCategory: RequestHandler = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id, categoryId } = req.params;
    ValidateMongoDbId(id);
    ValidateMongoDbId(categoryId);

    try {
      if (!id)
        next(throwError('No Admin record found', StatusCodes.BAD_REQUEST));
      if (!categoryId)
        next(throwError('No Category record found', StatusCodes.BAD_REQUEST));

      const category = await deleteCategoryM(categoryId);
      res.json({
        message: 'You have successfully deleted this category.',
      });
    } catch (error: any) {
      if (!error.statusCode) {
        error.statusCode = 500;
      }
      next(error);
    }
  }
);

export const findCategory: RequestHandler = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id, categoryId } = req.params;
    ValidateMongoDbId(id);
    ValidateMongoDbId(categoryId);

    try {
      if (!id)
        next(throwError('No Admin record found', StatusCodes.BAD_REQUEST));
      if (!categoryId)
        next(throwError('No Category record found', StatusCodes.BAD_REQUEST));

      const category = await findCategoryM(categoryId);
      res.json({
       category
      });
    } catch (error: any) {
      if (!error.statusCode) {
        error.statusCode = 500;
      }
      next(error);
    }
  }
);
