import { type Request, type Response } from 'express';
import prisma from '../../../prisma/prisma';

const startTraining = async (req: Request, res: Response) => {
  const { id: userId } = req.user;
  const { bookIds, startDate, finishDate } = req.body;

  const existingTraining = await prisma.training.findFirst({
    where: {
      userId,
      status: 'IN_PROGRESS',
    },
  });

  if (existingTraining) {
    return res.status(400).json({
      status: 'error',
      message: 'Training already active',
    });
  }

  const durationDays = Math.ceil(
    (+new Date(finishDate) - +new Date(startDate)) / (1000 * 60 * 60 * 24),
  );

  const training = await prisma.training.create({
    data: {
      userId,
      startDate: new Date(startDate),
      finishDate: new Date(finishDate),
      durationDays,
      status: 'IN_PROGRESS',
      books: {
        create: bookIds.map((bookId: number) => ({
          book: { connect: { id: bookId } },
        })),
      },
    },
    include: {
      books: true,
    },
  });

  await prisma.book.updateMany({
    where: { id: { in: bookIds } },
    data: {
      status: 'READING',
    },
  });

  res.status(201).json({
    status: 'success',
    message: 'Training started successfully',
    data: {
      training,
    },
  });
};

export { startTraining };
