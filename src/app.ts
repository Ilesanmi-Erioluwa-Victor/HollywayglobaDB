import express, { Application, NextFunction, Request, Response } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import helmet from 'helmet';
import morgan from 'morgan';

import adminRoute from './modules/Admin/routes/admin.routes';

import userRoute from './modules/User/routes/user.routes';

import productRoute from './modules/Admin/routes/admin.routes';

import reviewRoute from './modules/User/routes/review.routes';

import orderRoute from './modules/User/routes/review.routes';

import cartRoute from './modules/User/routes/review.routes';

import { requestErrorTypings } from './types';
import { SanitizeInputMiddleware } from './middlewares/sanitize';
import { customTime } from './interfaces/custom';
import { _404 } from './middlewares/error/_404Page';
import { ENV } from './configurations/env';

const app: Application = express();

app.use(cors());

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.json({ limit: '10kb' }));

app.use(helmet());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.set('Methods', 'GET, POST, PUT, DELETE , PATCH');
  res.set('Access-Control-Allow-Credentials', 'true');
  res.set('content-type', 'application/json');
  next();
});

ENV.MODE.DEVELOPMENT === 'development' ? app.use(morgan('dev')) : '';

app.use((req: customTime, res: Response, next: NextFunction) => {
  req.requestTime = new Date().toLocaleString();
  next();
});

app.use('/api/v1/user', userRoute);

app.use('/api/v1/admin', adminRoute);

app.use('/api/v1/products', productRoute);

app.use('/api/v1/reviews', reviewRoute);

app.use('/api/v1/cart', cartRoute);

app.use(SanitizeInputMiddleware.sanitizeInput);
// TODO Still facing weird bug here

app.all('*', (req: Request, res: Response, next: NextFunction) => {
  _404.notFound(req, res, next);
});

app.use(
  (
    error: requestErrorTypings,
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    console.log(error.message);
    const status = error.statusCode || 500;
    const message = error.message;
    res.status(status).json({ message });
  }
);

export default app;
