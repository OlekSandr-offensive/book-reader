import { Prisma } from '@prisma/client';
import { type NextFunction, type Request, type Response } from 'express';

const handlePrismaError = (
  err: unknown,
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    switch (err.code) {
      case 'P2002':
        return res.status(409).json({
          message: `Unique constraint failed on fields: ${err.meta?.target}`,
        });

      case 'P2025':
        return res.status(404).json({
          message: 'Record not found',
        });

      case 'P2003':
        return res.status(400).json({
          message: 'Invalid relation reference',
        });

      case 'P1001':
        return res.status(503).json({
          message: 'Cannot connect to database',
        });

      default:
        return res.status(400).json({
          message: 'Database error',
          code: err.code,
        });
    }
  }

  next(err);
};

export { handlePrismaError };
