import { Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';

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
}
