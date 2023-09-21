import { RequestHandler, NextFunction, Request, Response } from 'express';

import { Utils } from '../../../helper/utils';

import { categoryQuery } from '../models/admin.category.models';

const { catchAsync } = Utils;

import {
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
} from '../../../errors/customError';

const {
  createCategoryM,
  deleteCategoryM,
  editCategoryM,
  findCategoryIdM,
  findCategoriesM,
} = categoryQuery;

export const createCategory: RequestHandler = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const category = await createCategoryM(req.body, req.params.adminId);

    if (!category)
      throw new BadRequestError('error creating category, try again ...');
    
        res.json({
      status: 'success',
      message: 'you have successfully created category.',
    });
  }
);

export const editCategory: RequestHandler = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {

        const category = await editCategoryM(req.params.categoryId, req.params.body);

        if(!category) throw new NotFoundError("no category found ...")
        res.json({
          status : "success",
        message: 'you have successfully edited this category.',
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
