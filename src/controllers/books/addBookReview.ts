import { type Request, type Response } from 'express';
import prisma from '../../../prisma/prisma';
import { RequestError } from '../../helpers';

const addBookReview = async (req: Request, res: Response) => {
  const { id: userId } = req.user;
  const bookId = Number(req.params.id);
  const { rating, resume } = req.body;

  const book = await prisma.book.findFirst({
    where: {
      id: bookId,
      userId: userId,
    },
  });
  if (!book) {
    throw RequestError(404, 'Book not found');
  }

  if (book.status !== 'DONE') {
    throw RequestError(400, 'You can review only finished books');
  }

  const updatedBook = await prisma.book.update({
    where: { id: bookId },
    data: {
      rating,
      resume,
    },
  });

  res.status(200).json({
    status: 'success',
    data: {
      book: { updatedBook },
    },
  });
};

export { addBookReview };
