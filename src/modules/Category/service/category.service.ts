import { RequestHandler, NextFunction, Request, Response } from 'express';

import { Utils } from '../../../helper/utils';

import { categoryQuery } from '../../Admin/models/admin.category.models';

const { catchAsync } = Utils;

import { BadRequestError } from '../../../errors/customError';

const { findCategoriesM } = categoryQuery;

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
