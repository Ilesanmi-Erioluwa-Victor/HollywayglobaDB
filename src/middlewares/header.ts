import { Request, Response, NextFunction } from 'express';

export const header = (req: Request, res: Response, next: NextFunction) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.set('Methods', 'GET, POST, PUT, DELETE , PATCH');
  res.set('Access-Control-Allow-Credentials', 'true');
  res.set('content-type', 'application/json');
  next();
};
