import { RequestHandler, NextFunction, Request, Response } from 'express';

import { adminUserQuery } from './../models/admin.users.models';

import { Utils } from '../../../helper/utils';

const { catchAsync } = Utils;

const { getUsersAdminM } = adminUserQuery;

export const getUsersAdmin: RequestHandler = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const users = await getUsersAdminM();
    res.json({
      length: users.length,
      users,
    });
  }
);
