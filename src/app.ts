import express, {
  type Request,
  type Response,
  type NextFunction,
} from 'express';
import cors from 'cors';
import logger from 'morgan';
import cookieParser from 'cookie-parser';
import swaggerUi from 'swagger-ui-express';

import authRouter from './routes/api/auth';
import booksRouter from './routes/api/books';
import trainingRouter from './routes/api/training';
import HttpError from './helpers/HttpError';
import { handlePrismaError } from './helpers';
import { swaggerConfig } from './docs';

const app = express();

const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short';

app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.use(
  '/swagger',
  swaggerUi.serve,
  swaggerUi.setup(swaggerConfig, {
    swaggerOptions: { persistAuthorization: true, filter: true },
    customSiteTitle: 'Book Reader API Docs',
  }),
);
app.use('/api/auth', authRouter);
app.use('/api/books', booksRouter);
app.use('/api/training', trainingRouter);

app.get('/', (_, res) => {
  res.status(200).send('✅ Book Reader backend is running');
});

app.use((_: Request, res: Response) => {
  res.status(404).json({ message: 'Not found' });
});

app.use(handlePrismaError);

app.use((err: unknown, _: Request, res: Response, __: NextFunction) => {
  if (err instanceof HttpError) {
    return res.status(err.statusCode).json({
      message: err.message,
    });
  }
  console.error(err);
  return res.status(500).json({ message: 'Internal server error' });
});

export default app;
