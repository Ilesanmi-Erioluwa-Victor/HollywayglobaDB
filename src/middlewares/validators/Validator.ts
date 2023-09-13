import { Request, Response, NextFunction } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';
import { body, validationResult } from 'express-validator';
import { ParsedQs } from 'qs';

export class customValidator {
  static createUserValidation() {
    return [
      body('firstName')
        .notEmpty()
        .isString()
        .withMessage('firstName is required'),
      body('lastName')
        .notEmpty()
        .isString()
        .withMessage('lastName is required'),
      body('email').isEmail().withMessage('Email is required'),
      body('password').notEmpty().withMessage('Password is required'),
      body('mobile').notEmpty().withMessage('Phone number is required'),
    ];
  }

  static loginUserValidation() {
    return [
      body('email').isEmail().withMessage('Please, provide email'),
      body('password').notEmpty().withMessage('Please, provide password'),
    ];
  }

  static validate = (validations: any[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
      await Promise.all(
        validations.map(
          (validation: {
            run: (
              arg0: Request<
                ParamsDictionary,
                any,
                any,
                ParsedQs,
                Record<string, any>
              >
            ) => any;
          }) => validation.run(req)
        )
      );

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
      }
      next();
    };
  };
}
