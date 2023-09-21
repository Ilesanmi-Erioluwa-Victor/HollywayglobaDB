import { RequestHandler, NextFunction, Request, Response } from 'express';

import { StatusCodes } from 'http-status-codes';


import { Utils } from '../../../helper/utils';

import { CustomRequest } from '../../../interfaces/custom';

import { categoryQuery } from '../models/admin.category.models';

const { catchAsync, ValidateMongoDbId } = Utils;

const {
  createCategoryM,
  deleteCategoryM,
  editCategoryM,
  findCategoryIdM,
  findCategoriesM,
} = categoryQuery;

export const createCategory: RequestHandler = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    ValidateMongoDbId(id);
    try {
      if (!id)
        next(new AppError('No Admin record found', StatusCodes.BAD_REQUEST));
      const category = await createCategoryM(req.body, id);
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
        new AppError('Enter name of category to edit', StatusCodes.BAD_REQUEST)
      );
    try {
      if (!id)
        next(new AppError('No Admin record found', StatusCodes.BAD_REQUEST));
      if (!categoryId)
        next(new AppError('No Category record found', StatusCodes.BAD_REQUEST));

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
        next(new AppError('No Admin record found', StatusCodes.BAD_REQUEST));
      if (!categoryId)
        next(new AppError('No Category record found', StatusCodes.BAD_REQUEST));

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
        next(new AppError('No Admin record found', StatusCodes.BAD_REQUEST));
      if (!categoryId)
        next(new AppError('No Category record found', StatusCodes.BAD_REQUEST));

      const category = await findCategoryIdM(categoryId);
      res.json({
        category,
      });
    } catch (error: any) {
      if (!error.statusCode) {
        error.statusCode = 500;
      }
      next(error);
    }
  }
);

export const getCategories: RequestHandler = catchAsync(
  async (req: CustomRequest, res: Response, next: NextFunction) => {
    const authId = req?.authId;
    try {
      if (!authId)
        next(
          new AppError(
            'You are not authorized to perform this action',
            StatusCodes.FORBIDDEN
          )
        );

      const category = await findCategoriesM();
      res.json({
        length: category.length,
        category,
      });
    } catch (error: any) {
      if (!error.statusCode) {
        error.statusCode = 500;
      }
      next(error);
    }
  }
);
