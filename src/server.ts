import express, { Application, NextFunction, Request, Response } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import helmet from 'helmet';
import path from 'path';

import adminRoute from './modules/Admin/admin.controller';
import userRoute from './modules/User/user.controller';
import productRoute from './modules/Admin/product.controller';
import AppError from './utils';
import ErrorHandlerMiddleware from './middlewares/error';
import SanitizeInputMiddleware from './middlewares/sanitize';
import { ENV } from './configurations/config';
import { customTime } from './interfaces/custom';

const app: Application = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/images', express.static('images'));
app.use(express.static('public'));
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

app.use((req: customTime, res: Response, next: NextFunction) => {
  req.requestTime = new Date().toLocaleString();
  next();
});
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/public'));
});

app.use('/api/v1/admin', adminRoute);
app.use('/api/v1/user', userRoute);
app.use('/api/v1/products', productRoute);

app.use(SanitizeInputMiddleware.sanitizeInput);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!!`, 404));
});
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  ErrorHandlerMiddleware.sendErrorDev(err, res);
});

const startConnection = async () => {
  try {
    app.listen(ENV.PORT.PORT || 5000, () => {
      console.log(`App running on port ${ENV.PORT.PORT || 8080}`);
    });
  } catch (error: any) {
    console.log(error.message);
  }
};
startConnection();
