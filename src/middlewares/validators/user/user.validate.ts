import { Request, Response, NextFunction } from 'express';
const Joi = require('joi');

export class userValidator {
  static createUserValidation() {
    return Joi.object({
      lastName: Joi.string().required(),
      email: Joi.string().email().required(),
      password: Joi.string().required(),
      firstName: Joi.string().required(),
      mobile: Joi.string().required(),
    });
  }

  static loginUserValidation() {
    return Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    });
  }

  static forgetPasswordValidation() {
    return Joi.object({
      email: Joi.string().email().required(),
    });
  }

  static resetforgetPasswordValidation() {
    return Joi.object({
      password: Joi.string().email().required(),
    });
  }
}
