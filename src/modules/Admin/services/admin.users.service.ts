import { RequestHandler, NextFunction, Request, Response } from 'express';

import { adminUserQuery } from './../models/admin.users.models';

import { Utils } from '../../../helper/utils';

const { catchAsync } = Utils;

import {
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
} from '../../../errors/customError';

const { getUsersAdminM } = adminUserQuery;

export const getUsersAdmin: RequestHandler = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const users = await getUsersAdminM();

    if (!users) throw new BadRequestError('something went wrong');

    res.json({
      status: 'success',
      message: 'ok',
      length: users.length,
      data: users,
    });
  }
);
