import { type Request, type Response } from 'express';
import prisma from '../../../prisma/prisma';
import { RequestError } from '../../helpers';

const getCurrentTraining = async (req: Request, res: Response) => {
  const { id: userId } = req.user;

  const now = new Date();
  await prisma.training.updateMany({
    where: {
      userId,
      status: 'IN_PROGRESS',
      finishDate: { lt: now },
    },
    data: {
      status: 'EXPIRED',
    },
  });

  const training = await prisma.training.findFirst({
    where: {
      userId,
      status: 'IN_PROGRESS',
    },
    include: {
      books: {
        include: {
          book: true,
        },
      },
    },
  });

  if (!training) {
    throw RequestError(404, 'No active training found');
  }

  res.status(200).json({
    status: 'success',
    data: { training },
  });
};

export { getCurrentTraining };
