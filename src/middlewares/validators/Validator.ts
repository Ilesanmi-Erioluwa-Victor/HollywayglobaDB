import { Request, Response, NextFunction } from 'express';
const Joi = require('joi');

export class customValidator {
  static createUserValidation() {
    return Joi.object({
      lastName: Joi.string().required(),
      email: Joi.string().email().required(),
      password: Joi.string().required(),
      firstName: Joi.string().required(),
      mobile: Joi.string().required(),
    });
  }

  static loginUserValidation() {}

  static validateBody = (validations: any) => {
    return async (req: Request, res: Response, next: NextFunction) => {
      const { error } = validations.validate(req.body);
      if (error) {
        return res.status(400).json({ error: error.details[0].message });
      }
      next();
    };
  };
}
