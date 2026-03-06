import { type NextFunction, type Request, type Response } from 'express';
import { RequestError } from '../helpers';

const isValidId = (req: Request, _: Response, next: NextFunction) => {
  const { id } = req.params;
  const parsedId = Number(id);

  if (!id || Number.isNaN(parsedId) || parsedId <= 0) {
    return next(RequestError(400, `Invalid ID: ${id}`));
  }
  next();
};

export { isValidId };
