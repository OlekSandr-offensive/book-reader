import { type Request, type Response, type NextFunction } from 'express';
import { type Schema } from 'joi';
import { RequestError } from '../helpers';

const validationBody = (schema: Schema) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body);

    if (error) {
      return next(RequestError(400, error.message));
    }

    next();
  };
};

export { validationBody };
