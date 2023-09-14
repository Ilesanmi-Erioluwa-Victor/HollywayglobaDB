import { Request, Response, NextFunction } from 'express';
const Joi = require('joi');

export class customValidator {
  static validateBody = (validations: any) => {
    return async (req: Request, res: Response, next: NextFunction) => {
      const { error } = validations.validate(req);
      if (error) {
        return res.status(400).json({ error: error.details[0].message });
      }
      next();
    };
  };

  static validateReq = (validations: any) => {
    return async (req: Request, res: Response, next: NextFunction) => {
      const { error } = validations.validate(req.params);
      if (error) {
        return res.status(400).json({ error: error.details[0].message });
      }
      next();
    };
  };
}
