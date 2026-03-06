import { type Request, type Response } from 'express';
import prisma from '../../../prisma/prisma';

const getTrainingStats = async (req: Request, res: Response) => {
  const { id } = req.params;

  const trainingBooks = await prisma.trainingBook.findMany({
    where: { trainingId: Number(id) },
    include: { book: true },
  });

  const totalPages = trainingBooks.reduce(
    (sum, item) => sum + item.book.totalPages,
    0,
  );

  const read = await prisma.dailyProgress.aggregate({
    where: { trainingId: Number(id) },
    _sum: { pagesRead: true },
  });

  const dailyProgress = await prisma.dailyProgress.findMany({
    where: { trainingId: Number(id) },
    orderBy: { date: 'asc' },
    select: {
      date: true,
      pagesRead: true,
    },
  });

  res.status(200).json({
    status: 'success',
    data: {
      totalPages,
      pagesRead: read._sum.pagesRead || 0,
      percent: Math.floor(((read._sum.pagesRead || 0) / totalPages) * 100),
      dailyProgress,
    },
  });
};

export { getTrainingStats };
