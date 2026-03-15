import { type Request, type Response } from 'express';
import prisma from '../../../prisma/prisma';
import dayjs from 'dayjs';
import { RequestError } from '../../helpers';

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
    throw RequestError(400, 'You already have an active training');
  }
  const startTraining = dayjs(startDate).startOf('day');
  const finishTraining = dayjs(finishDate).endOf('day');
  const durationDays = finishTraining.diff(startTraining, 'day') + 1;

  const training = await prisma.training.create({
    data: {
      userId,
      startDate: startTraining.toDate(),
      finishDate: finishTraining.toDate(),
      durationDays,
      status: 'IN_PROGRESS',
      books: {
        create: bookIds.map((bookId: number) => ({
          book: { connect: { id: bookId } },
        })),
      },
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
