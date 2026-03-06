import { type Request, type Response } from 'express';
import prisma from '../../../prisma/prisma';

const getBookProgress = async (req: Request, res: Response) => {
  const { id: userId } = req.user;
  const { id: bookId } = req.params;

  const book = await prisma.book.findFirst({
    where: {
      userId: Number(userId),
      id: Number(bookId),
    },
  });

  if (!book) {
    return res.status(404).json({ message: 'Book not found' });
  }

  const progress = await prisma.dailyProgress.aggregate({
    _sum: { pagesRead: true },
    where: { bookId: Number(bookId) },
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
