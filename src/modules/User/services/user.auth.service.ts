import  bcrypt  from 'bcryptjs';
import { RequestHandler, NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { throwError } from '../../../middlewares/error/cacheError';
import { catchAsync, ValidateMongoDbId, generateToken, createAccountVerificationToken, generatePasswordResetToken } from '../../../helper/utils';

