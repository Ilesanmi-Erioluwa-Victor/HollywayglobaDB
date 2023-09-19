import { body, param, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

import { prisma } from '../configurations/db';

import {
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
} from '../errors/customError';
import { authQuery } from '../modules/Auth/models/user.auth.model';
import { Utils } from '../helper/utils';

const { ValidateMongoDbId } = Utils;

const { findUserMEmail } = authQuery;

const withValidationErrors = (validateValues: any) => {
  return [
    validateValues,
    (req: Request, res: Response, next: NextFunction) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const errorMessages: any = errors
          .array()
          .map((error: any) => `${error.path} : ${error.msg}`);

        // const firstMessage = errorMessages[0];
        // console.log(Object.getPrototypeOf(firstMessage));
        if (errorMessages[0].startsWith('no job')) {
          throw new NotFoundError(errorMessages);
        }
        if (errorMessages[0].startsWith('not authorized')) {
          console.log('from Unauthorized', errorMessages);
          throw new UnauthorizedError('not authorized to access this route');
        }
        throw new BadRequestError(errorMessages);
      }
      next();
    },
  ];
};

export const validateRegisterInput = withValidationErrors([
  body('firstName').notEmpty().withMessage('first name is required'),
  body('email')
    .notEmpty()
    .withMessage('email is required')
    .isEmail()
    .withMessage('invalid email format')
    .custom(async (email) => {
      const user = await findUserMEmail(email);
      if (user) {
        throw new BadRequestError('email already exists');
      }
    }),
  body('password').notEmpty().withMessage('Password is required'),
  body('mobile').notEmpty().withMessage('Mobile phone is required'),
  body('lastName').notEmpty().withMessage('last name is required'),
]);

export const validateLoginInput = withValidationErrors([
  body('email')
    .notEmpty()
    .withMessage('email is required')
    .isEmail()
    .withMessage('invalid email format'),
  body('password').notEmpty().withMessage('Password is required'),
]);

export const validateUserIdParam = withValidationErrors([
  param('id').custom(async (value, { req }) => {
    const isValidMongoId = ValidateMongoDbId(value);

    if (!isValidMongoId) throw new BadRequestError('invalid MongoDB id');

    const user = await prisma.user.findUnique(value);

    if (!user) throw new NotFoundError('no user associated with this id ...');

    const isOwner = req.user.userId.toString() === req.params?.id.toString();

    if (!isOwner)
      throw new UnauthorizedError('not authorized to access this route');
  }),
]);

export const validateAdminIdParam = withValidationErrors([
  param('adminId').custom(async (value, { req }) => {
    const isValidMongoId = ValidateMongoDbId(value);

    if (!isValidMongoId) throw new BadRequestError('invalid MongoDB id');

    const admin = await prisma.admin.findUnique(value);

    if (!admin) throw new NotFoundError('no user associated with this id ...');

    const isOwner = req.user.userId.toString() === req.params?.id.toString();

    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin)
      throw new UnauthorizedError('not authorized to access this route');
  }),
]);
