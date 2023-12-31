import 'express-async-errors';
import express, { Application } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import compression from 'compression';

import adminRoute from './modules/Admin/routes/admin.routes';

import authRoute from './modules/Auth/routes/user.auth.routes';

import userRoute from './modules/User/routes/user.routes';

import productRoute from './modules/Product/routes/product.routes';

import categoryRoute from './modules/Category/routes/category.routes';

import reviewRoute from './modules/User/routes/review.routes';

import orderRoute from './modules/Order/routes/order.routes';

import cartRoute from './modules/Cart/routes/cart.routes';

import checkoutRoute from './modules/Checkout/routes/checkout.routes';

import adminAuth from './modules/Admin/routes/admin.auth.routes';

import { SanitizeInputMiddleware } from './middlewares/sanitize';

import { _404 } from './errors/_404Page';

import { ENV } from './configurations/env';

import errorHandlerMiddleware from './middlewares/errorHandlerMiddleware';

import { Auth } from './middlewares/auth';

import { header } from './middlewares/header';

const { authenticateUser } = Auth;

const app: Application = express();

app.use(cookieParser());

app.use(cors());

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.json({ limit: '10kb' }));

app.use(helmet());

app.use(compression());

app.use(header);

ENV.MODE.MODE === 'development' ? app.use(morgan('dev')) : '';

app.use('/api/v1/auth', authRoute);

app.use('/api/v1/user', authenticateUser, userRoute);

app.use('/api/v1/adminAuth', adminAuth);

app.use('/api/v1/admin', authenticateUser, adminRoute);

app.use('/api/v1/products', productRoute);

app.use('/api/v1/categories', categoryRoute);

app.use('/api/v1/reviews', authenticateUser, reviewRoute);

app.use('/api/v1/cart', authenticateUser, cartRoute);

app.use('/api/v1/order', authenticateUser, orderRoute);

app.use('/api/v1/checkout', authenticateUser, checkoutRoute);

app.get('/api', (req, res, next) => {
  res.send('welcome to hollywayglobal api endpoint');
});
app.use(SanitizeInputMiddleware.sanitizeInput);

app.all('*', _404.notFound);

app.use(errorHandlerMiddleware);

export default app;
