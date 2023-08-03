import bcrypt from 'bcryptjs';
import { RequestHandler, NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { throwError } from '../../../middlewares/error/cacheError';
import {
  catchAsync,
  ValidateMongoDbId,
  generateToken,
    createAccountVerificationTokenAdmin,
  generatePasswordResetToken
} from '../../../helper/utils';

import { CustomRequest } from '../../../interfaces/custom';

export const adminSignup : RequestHandler = catchAsync(
    async (req: Request,  res : Response, next: NextFunction) => {
     try {
         const { email, password, name } = req.body;
     } catch (error : any ) {
        
     }
    }
)
