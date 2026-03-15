import { type Request, type Response } from 'express';
import prisma from '../../../prisma/prisma';
import { RequestError } from '../../helpers';

const getBookProgress = async (req: Request, res: Response) => {
  const { id: userId } = req.user;
  const bookId = Number(req.params.id);

  const book = await prisma.book.findFirst({
    where: {
      userId: userId,
      id: bookId,
    },
  });

  if (!book) {
    throw RequestError(404, 'Book not found');
  }

  const progress = await prisma.dailyProgress.aggregate({
    _sum: { pagesRead: true },
    where: { bookId: bookId },
  });

  const pagesRead = progress._sum.pagesRead || 0;
  const percent = Math.floor((pagesRead / book.totalPages) * 100);

  res.status(200).json({
    status: 'success',
    data: {
      bookId: book.id,
      totalPages: book.totalPages,
      pagesRead,
      percent,
    },
  });
};

export { getBookProgress };
