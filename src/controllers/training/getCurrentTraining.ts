import { type Request, type Response } from 'express';
import prisma from '../../../prisma/prisma';

const getCurrentTraining = async (req: Request, res: Response) => {
  const { id: userId } = req.user;
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
    return res.status(404).json({
      status: 'error',
      message: 'No active training found',
    });
  }
  return res.json({
    status: 'success',
    data: { training },
  });
};

export { getCurrentTraining };
