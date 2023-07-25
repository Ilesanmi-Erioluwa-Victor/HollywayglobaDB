import express, { Application, NextFunction, Request, Response } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import path from 'path';
dotenv.config();

import adminRouter from './routes/admin/adminRoute';
import userRouter from './routes/user/userRoute';
import { requestErrorInterface } from './interfaces/requestErrorInterface';
import { pageNotFound } from './middlewares/error/_404';

const app: Application = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/images', express.static('images'));
app.use(express.static('public'));
app.use(express.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.set('Methods', 'GET, POST, PUT, DELETE , PATCH');
  res.set('Access-Control-Allow-Credentials', 'true');
  res.set('content-type', 'application/json');
  next();
});

app.use('/api/v1/admin/', adminRouter);
app.use('/api/v1/user', userRouter);
app.use(pageNotFound);
app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, '/public'));
});
// TODO still have ab ug to fix here
// app.use(
//   (
//     error: requestErrorInterface,
//     req: Request,
//     res: Response,
//     next: NextFunction
//   ) => {
//     console.log(error.message);
//     const status = error.statusCode || 500;
//     const message = error.message;
//     res.status(status).json({ message });
//   }
// );

const startConnection = async () => {
  try {
    app.listen(process.env.PORT || 5000, () => {
      console.log(`App running on port ${process.env.PORT || 8080}`);
    });
  } catch (error: any) {
    console.log(error.message);
  }
};
startConnection();
