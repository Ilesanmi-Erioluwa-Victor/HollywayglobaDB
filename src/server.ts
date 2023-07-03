import express, { Application, NextFunction, Request, Response } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import path from 'path';

import adminRouter from "./routes/admin/adminRoute"
import userRouter from './routes/user/userRoute';
// import api from './services/v1Api';
// import uploadFile from './uploads/uploadFile';
// import { requestErrorTypings } from './typings/requestErrorTypings';
// import { pageNotFound } from './middleware/404';
import { connectFunction } from './database/Database';

dotenv.config();
const app: Application = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(uploadFile);
app.use('/images', express.static('images'));
app.use(express.static('public'));
app.use(express.json());

// set headers for all requests
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.set('Methods', 'GET, POST, PUT, DELETE , PATCH');
  res.set('Access-Control-Allow-Credentials', 'true');
  res.set('content-type', 'application/json');
  next();
});

// version 1 api
app.use('/api/v1/admin', adminRouter);
app.use('/api/v1/admin', userRouter);
// app.use(pageNotFound);

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, '/public'));
});

// error handling
// app.use(
//   (
//     // error: requestErrorTypings,
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

// connecting server
const startConnection = async () => {
  try {
    await connectFunction();
    app.listen(process.env.PORT || 5000, () => {
      console.log(`App running on port ${process.env.PORT || 8080}`);
    });
  } catch (error: any) {
    console.log(error.message);
  }
};
startConnection();
