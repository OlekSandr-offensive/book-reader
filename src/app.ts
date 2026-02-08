import express, {type Request,type Response,type NextFunction } from 'express';
import { type IError } from './interfaces/error.interface';
import {prisma} from "../prisma/prisma";

const app = express();
app.use(express.json());


app.get('/', async (_: Request, res: Response) => {
   const users = await prisma.user.findMany();
  res.status(200).json(users);
});

app.use((_: Request, res: Response) => {
  res.status(404).json({ message: 'Not found' });
});

app.use((err: IError, _: Request, res: Response, __: NextFunction) => {
  const { statusCode = 500, message = 'Server error' } = err;
  res.status(statusCode).json({ message });
});

export default app;