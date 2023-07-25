import { RequestHandler } from 'express';

export const pageNotFound: RequestHandler = (req, res, next) => {
  res.status(404).send('Page not found');
};
