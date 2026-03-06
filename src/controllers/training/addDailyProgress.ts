import { Request, Response } from 'express';
import prisma from '../../../prisma/prisma';
import { RequestError } from '../../helpers';

const addDailyProgress = async (req: Request, res: Response) => {
  const { id: userId } = req.user;
  const { trainingId, bookId, pagesRead } = req.body;

  const progress = await prisma.dailyProgress.create({
    data: {
      userId,
      trainingId,
      bookId,
      pagesRead,
      date: new Date(),
    },
  });

  const aggregation = await prisma.dailyProgress.aggregate({
    where: { trainingId },
    _sum: { pagesRead: true },
  });

  const totalRead = aggregation._sum.pagesRead ?? 0;

  const book = await prisma.book.findUnique({
    where: {
      id: bookId,
    },
  });

  if (!book) {
    throw RequestError(404, 'Book not found');
  }

  if (totalRead >= book.totalPages) {
    await prisma.book.update({
      where: { id: bookId },
      data: { status: 'DONE' },
    });
    await prisma.trainingBook.updateMany({
      where: { trainingId, bookId },
      data: { isFinished: true },
    });
  }

  return res.json({
    status: 'success',
    data: { progress },
  });
};
export { addDailyProgress };
