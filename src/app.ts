import 'express-async-errors';
import express, { Application, NextFunction, Request, Response } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';

import adminRoute from './modules/Admin/routes/admin.routes';

import authRoute from './modules/Auth/routes/user.auth.routes';

import userRoute from './modules/User/routes/user.routes';

import productRoute from './modules/Product/routes/product.routes';

import reviewRoute from './modules/User/routes/review.routes';

// import orderRoute from './modules/User/routes/order.routes';

import cartRoute from './modules/Cart/routes/cart.routes';

import { SanitizeInputMiddleware } from './middlewares/sanitize';

import { customTime } from './interfaces/custom';

import { _404 } from './errors/_404Page';

import { ENV } from './configurations/env';

import errorHandlerMiddleware from './middlewares/errorHandlerMiddleware';

import { Auth } from './middlewares/auth';

const { authenticateUser } = Auth;

const app: Application = express();

app.use(cookieParser());

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

ENV.MODE.MODE === 'development' ? app.use(morgan('dev')) : '';

app.use((req: customTime, res: Response, next: NextFunction) => {
  req.requestTime = new Date().toLocaleString();
  next();
});

app.use('/api/v1/auth', authRoute);

app.use('/api/v1/user', authenticateUser, userRoute);

app.use("/api/v1/adminAuth", )

app.use('/api/v1/admin', authenticateUser, adminRoute);

app.use('/api/v1/products', productRoute);

app.use('/api/v1/reviews', authenticateUser, reviewRoute);

app.use('/api/v1/cart', authenticateUser, cartRoute);

// app.use('/api/v1/order', authenticateUser, orderRoute);

app.use(SanitizeInputMiddleware.sanitizeInput);

app.all('*', _404.notFound);

app.use(errorHandlerMiddleware);

export default app;
