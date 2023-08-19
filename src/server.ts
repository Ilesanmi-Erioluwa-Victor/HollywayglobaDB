


import { ENV } from './configurations/config';




ENV.MODE.DEVELOPMENT === 'development' ? app.use(morgan('dev')) : '';

app.use((req: customTime, res: Response, next: NextFunction) => {
  req.requestTime = new Date().toLocaleString();
  next();
});

app.use('/api/v1/user', userRoute);

app.use('/api/v1/admin', adminRoute);

app.use('/api/v1/products', productRoute);

app.use(SanitizeInputMiddleware.sanitizeInput);
// TODO Still facing weird bug here

app.all('*', (req: Request, res: Response, next: NextFunction) => {
  _404.notFound(req, res, next);
});

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  ErrorHandlerMiddleware.sendErrorDev(err, res);
});

const startConnection = async () => {
  try {
    app.listen(ENV.PORT.PORT || 5000, () => {
      console.log(`App running on port ${ENV.PORT.PORT || 5000}`);
    });
  } catch (error: any) {
    console.log(error.message);
  }
};
startConnection();
