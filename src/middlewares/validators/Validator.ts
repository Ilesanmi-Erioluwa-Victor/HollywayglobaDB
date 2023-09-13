import { Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';

export class customValidator {
  static createUserValidation() {
    return [
      body('firstName')
        .notEmpty()
        .isString()
        .withMessage('firstName is required'),
      body('lastName').isEmail().withMessage('lastName is required'),
      body('password').notEmpty().withMessage('Password is required'),
      body('mobile').notEmpty().withMessage('Phone number is required'),
    ];
  }
}
