import { ENV } from '../configurations/env/';
import jwt from 'jsonwebtoken';

export const createJwt = (payload: { userId: string; role: string }) => {
  const token = jwt.sign(payload, ENV.JWT.SECRET as string, {
    expiresIn: ENV.JWT.EXPIRES,
  });

  return token;
};

export const verifyJWT = (token: string) => {
  const decoded = jwt.verify(token, ENV.JWT.SECRET as string);
  return decoded;
};

export const ORDER_STATUS = {
  PENDING: 'PENDING',
  PROCESSING: 'PROCESSING',
  SHIPPED: 'SHIPPED',
  DELIVERED: 'DELIVERED',
  CANCELED: 'CANCELED',
};
