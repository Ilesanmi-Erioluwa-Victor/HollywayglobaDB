import { NextFunction, Request, Response } from 'express';

import jwt from 'jsonwebtoken';

import {
  UnauthenticatedError,
  NotFoundError,
  BadRequestError,
} from '../../errors/customError';

import { Utils } from '../../helper/utils';
import { ENV } from '../../configurations/env';
import { authQuery } from '../../modules/Auth/models/user.auth.model';

const { findUserMId } = authQuery;
const { catchAsync } = Utils;

export class Auth {
  static authenticateUser = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const authHeader = req.get('Authorization');

        if (!authHeader)
          throw new BadRequestError('Authorization token is required');

        let decode: any;

        const token = authHeader?.split(' ')[1];
        decode = jwt.verify(token as string, `${ENV.JWT.SECRET}`);

        if (!token || !decode) throw new BadRequestError('Invalid token');

        req.user = decode;

        next();
      } catch (error: any) {
        next(error);
      }
    }
  );
}
