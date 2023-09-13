import { Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';

export class customValidator {
    static createUserValidation() {
        return [
          body('username').notEmpty().isString(),
          body('email').isEmail(),
          body('password').isLength({ min: 6 }),
        ];
  }
}
