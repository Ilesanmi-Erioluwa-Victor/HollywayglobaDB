import express, { Application, NextFunction, Request, Response } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import helmet from 'helmet';
import morgan from 'morgan';

import adminRoute from './modules/Admin/routes/admin.routes';
import userRoute from './modules/User/routes/user.routes';
import productRoute from './modules/Admin/routes/admin.routes';
import ErrorHandlerMiddleware from './middlewares/error';
import { SanitizeInputMiddleware } from './middlewares/sanitize';
import { customTime } from './interfaces/custom';
import { _404 } from './middlewares/error/_404Page';

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
