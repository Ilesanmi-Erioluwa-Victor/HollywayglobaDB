import { body, param, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';
import {
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
} from '../errors/customError';


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


export const validateUserInput = withValidationErrors([
  body('firstName').notEmpty().withMessage('firstName is required'),
  body('lastName').notEmpty().withMessage('astName is required'),
  body('password').notEmpty().withMessage('Password is required'),
  body("mobile").notEmpty().withMessage('Phone number is required')
]);
