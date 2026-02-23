import express, {type Request,type Response,type NextFunction } from 'express';
import { type IError } from './interfaces/error.interface';
import handlePrismaError from './helpers/handlePrismaError';
import authRouter from './routes/api/users';
import booksRouter from './routes/api/books';

const app = express();
app.use(express.json());


app.use('/api/users', authRouter);
app.use('/api/books', booksRouter);

app.use(handlePrismaError);

app.get('/', (_, res) => {
  res.status(200).send('✅ Book Reader backend is running');
});

app.use((_: Request, res: Response) => {
  res.status(404).json({ message: 'Not found' });
});

app.use((err: IError, _: Request, res: Response, __: NextFunction) => {
  const { statusCode = 500, message = 'Server error' } = err;
  res.status(statusCode).json({ message });
});

export default app;