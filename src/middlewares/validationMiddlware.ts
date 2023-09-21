import { body, param, validationResult } from 'express-validator';

import { Request, Response, NextFunction } from 'express';

import { prisma } from '../configurations/db';

import {
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
} from '../errors/customError';

import { authQuery } from '../modules/Auth/models/user.auth.model';

import { addressQuery } from '../modules/User/models/user.address.model';

import { reviewQuery } from '../modules/User/models/user.review.model';

import { productQuery } from '../modules/Product/models/product.model';

import { adminQuery } from '../modules/Admin/models/admin.models';

import { Utils } from '../helper/utils';

const { ValidateMongoDbId } = Utils;

const { findUserMEmail, findUserMId } = authQuery;

const { findProductId } = productQuery;

const { findAddressM } = addressQuery;

const { findReviewIdM } = reviewQuery;

const { findAdminEmailM } = adminQuery;

const withValidationErrors = (validateValues: any) => {
  return [
    validateValues,
    (req: Request, res: Response, next: NextFunction) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const errorMessages: any = errors
          .array()
          .map((error: any) => `${error.path} : ${error.msg}`);

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

export const validateEmailInput = withValidationErrors([
  body('email')
    .notEmpty()
    .withMessage('email is required')
    .isEmail()
    .withMessage('invalid email format'),
]);

export const validatePasswordInput = withValidationErrors([
  body('password').notEmpty().withMessage('password is required'),
]);

export const validateNewAddressInput = withValidationErrors([
  body('deliveryAddress')
    .notEmpty()
    .withMessage('delivery address is required'),
  body('region').notEmpty().withMessage('state is required'),
  body('city').notEmpty().withMessage('city is required'),
  body('country').notEmpty().withMessage('country is required'),
]);

export const validateNewReviewInput = withValidationErrors([
  body('text').notEmpty().withMessage('text is required'),
  body('rating').notEmpty().withMessage('rating is required'),
]);

export const validateUserIdParam = withValidationErrors([
  param('id').custom(async (value, { req }) => {
    const isValidMongoId = ValidateMongoDbId(value);

    if (!isValidMongoId) throw new BadRequestError('invalid MongoDB id');

    const user = await findUserMId(value);

    if (!user) throw new NotFoundError('no user associated with this id ...');

    const isOwner = req.user.userId.toString() === req.params?.id.toString();

    if (!isOwner)
      throw new UnauthorizedError('not authorized to access this route');
  }),
]);

export const validateProductIdParam = withValidationErrors([
  param('productId').custom(async (value) => {
    const isValidMongoId = ValidateMongoDbId(value);

    if (!isValidMongoId) throw new BadRequestError('invalid MongoDB id');

    const product = await findProductId(value);

    if (!product) throw new NotFoundError('no product found ...');
  }),
]);

export const validateReviewIdParam = withValidationErrors([
  param('reviewId').custom(async (value) => {
    const isValidMongoId = ValidateMongoDbId(value);

    if (!isValidMongoId) throw new BadRequestError('invalid MongoDB id');

    const review = await findReviewIdM(value);

    if (!review) throw new NotFoundError('no review found ...');
  }),
]);

export const validateAddressIdParam = withValidationErrors([
  param('addressId').custom(async (value, { req }) => {
    const isValidMongoId = ValidateMongoDbId(value);

    if (!isValidMongoId) throw new BadRequestError('invalid MongoDB id');

    const address = await findAddressM(value);

    if (!address)
      throw new NotFoundError('no address associated with this id ...');
  }),
]);

export const validateAdminSignupInput = withValidationErrors([
  body('name').notEmpty().withMessage('name is required'),
  body('email')
    .notEmpty()
    .withMessage('email is required')
    .isEmail()
    .withMessage('invalid email format')
    .custom(async (email) => {
      const admin = await findAdminEmailM(email);
      if (admin) {
        throw new BadRequestError('email already exists');
      }
    }),
  body('password').notEmpty().withMessage('Password is required'),
]);

export const validateAdminLoginInput = withValidationErrors([
  body('email')
    .notEmpty()
    .withMessage('email is required')
    .isEmail()
    .withMessage('invalid email format'),
  body('password').notEmpty().withMessage('Password is required'),
]);

export const validateAdminIdParam = withValidationErrors([
  param('adminId').custom(async (value, { req }) => {
    const isValidMongoId = ValidateMongoDbId(value);

    if (!isValidMongoId) throw new BadRequestError('invalid MongoDB id');

    const admin = await prisma.admin.findUnique({
      where: {
        id: value,
      },
    });
    if (!admin) throw new NotFoundError('no user associated with this id ...');

    const isOwner = req.user.userId.toString() === req.params?.adminId.toString();

    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin)
      throw new UnauthorizedError('not authorized to access this route');
  }),
]);
