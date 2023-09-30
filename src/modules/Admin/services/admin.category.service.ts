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

// TODO a little bug here to fix
export const createCategory: RequestHandler = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const category = await createCategoryM(req.body, req.params.adminId);

    if (!category)
      throw new BadRequestError('error creating category, try again ...');

    res.json({
      status: 'success',
      message: 'you have successfully created category.',
      data: category,
    });
  }
);

export const editCategory: RequestHandler = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const category = await editCategoryM(
      req.params.categoryId,
      req.params.body
    );

    if (!category) throw new NotFoundError('no category found ...');
    res.json({
      status: 'success',
      message: 'you have successfully edited this category.',
    });
  }
);

export const deleteCategory: RequestHandler = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const category = await deleteCategoryM(req.params.categoryId);
    if (!category) throw new NotFoundError('no category found');
    res.json({
      status: 'success',
      message: 'you have successfully deleted this category.',
    });
  }
);

export const getCategory: RequestHandler = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const category = await findCategoryIdM(req.params.categoryId);
    res.json({
      status: 'success',
      message: 'ok',
      data: category,
    });
  }
);

export const getCategories: RequestHandler = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const category = await findCategoriesM();
    if (!category) throw new BadRequestError('error fetching categories');

    res.json({
      length: category.length,
      status: 'success',
      message: 'ok',
      data: category,
    });
  }
);
