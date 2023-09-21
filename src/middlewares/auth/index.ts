import { NextFunction, Request, Response } from 'express';

import { verifyJWT } from '../../utils/index';

import { UnauthenticatedError } from '../../errors/customError';

import { Utils } from '../../helper/utils';

const { catchAsync } = Utils;

export class Auth {
  static authenticateUser = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const { token } = req.cookies;

      if (!token) throw new UnauthenticatedError('authentication failed');

      try {
        const jwt: { userId: string; role: string } | any = verifyJWT(token);
        req.user = { userId: jwt?.userId, role: jwt.role };
        next();
      } catch (error) {
        throw new UnauthenticatedError('authentication failed');
      }
    }
  );
}
