


import { ENV } from './configurations/config';
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
