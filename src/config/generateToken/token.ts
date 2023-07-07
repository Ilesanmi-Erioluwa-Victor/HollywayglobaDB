import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import { throwError } from '../../middlewares/cacheError';
import { StatusCodes } from 'http-status-codes';

dotenv.config();

const generateToken = (id: string) => {
  if (!process.env.JWT_KEY)
    throwError('JWT_KEY is required in environment', StatusCodes.BAD_REQUEST);
  return jwt.sign({ id }, `${process.env.JWT_SERCRET_KEY}`, {
    expiresIn: `${process.env.JWT_EXPIRES_IN}`,
  });
};

export default generateToken;
