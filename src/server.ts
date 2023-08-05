import express, { Application, NextFunction, Request, Response } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import helmet from "helmet"
import path from 'path';

import adminRouter from './modules/Admin/admin.controller';
import userRoute from './modules/User/user.controller';
import { requestErrorInterface } from './interfaces/requestErrorInterface';
import { pageNotFound } from './middlewares/error/_404';
import { ENV } from './configurations/config';
const app: Application = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/images', express.static('images'));
app.use(express.static('public'));
app.use(express.json());
app.use(helmet());
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.set('Methods', 'GET, POST, PUT, DELETE , PATCH');
  res.set('Access-Control-Allow-Credentials', 'true');
  res.set('content-type', 'application/json');
  next();
});

app.use('/api/v1/admin', adminRouter);
app.use('/api/v1/user', userRoute);
app.use(pageNotFound);
app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, '/public'));
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
