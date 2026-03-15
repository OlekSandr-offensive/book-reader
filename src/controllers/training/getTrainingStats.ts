import { type Request, type Response } from 'express';
import prisma from '../../../prisma/prisma';
import { RequestError } from '../../helpers';

const getTrainingStats = async (req: Request, res: Response) => {
  const { id: userId } = req.user;
  const trainingId = Number(req.params.id);

  const [training, readProgress] = await Promise.all([
    prisma.training.findUnique({
      where: { id: trainingId, userId: userId },
      include: {
        books: {
          include: { book: { select: { totalPages: true } } },
        },
      },
    }),
    prisma.dailyProgress.findMany({
      where: { trainingId },
      orderBy: { date: 'asc' },
      select: { date: true, pagesRead: true },
    }),
  ]);

  if (!training) throw RequestError(404, 'Training not found');

  const totalPages = training.books.reduce(
    (sum, item) => sum + item.book.totalPages,
    0,
  );

  const pagesRead = readProgress.reduce(
    (acc, progress) => acc + progress.pagesRead,
    0,
  );

  res.status(200).json({
    status: 'success',
    data: {
      totalPages,
      pagesRead,
      percent: totalPages > 0 ? Math.floor((pagesRead / totalPages) * 100) : 0,
      dailyProgress: readProgress,
    },
  });
};

export { getTrainingStats };
