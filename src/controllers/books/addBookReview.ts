import { type Request, type Response } from 'express';
import prisma from '../../../prisma/prisma';

const addBookReview = async (req: Request, res: Response) => {
  const { id: userId } = req.user;
  const { id: bookId } = req.params;
  const { rating, resume } = req.body;

  const book = await prisma.book.findFirst({
    where: {
      id: Number(bookId),
      userId: Number(userId),
    },
  });
  if (!book) {
    return res.status(404).json({ message: 'Book not found' });
  }

  if (book.status !== 'DONE') {
    return res
      .status(400)
      .json({ message: 'You can review only finished books' });
  }

  const updatedBook = await prisma.book.update({
    where: { id: Number(bookId) },
    data: {
      rating,
      resume,
    },
  });

  res.status(200).json({
    status: 'success',
    data: { updatedBook },
  });
};

export { addBookReview };
