import { type Request, type Response } from 'express';
import prisma from '../../../prisma/prisma';
import { RequestError } from '../../helpers';

const updateBook = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { id: userId } = req.user;
  const { title, author, year, totalPages } = req.body;

  const existingBook = await prisma.book.findUnique({
    where: { id: Number(id) },
  });
  if (!existingBook) {
    throw RequestError(404, `Book with id ${id} not found`);
  }
  if (existingBook.userId !== userId) {
    throw RequestError(403, 'Forbidden: This book does not belong to you');
  }
  const updatedBook = await prisma.book.update({
    where: { id: Number(id) },
    data: {
      title,
      author,
      year,
      totalPages: Number(totalPages),
    },
  });
  res.status(200).json({
    status: 'success',
    message: 'Book updated successfully',
    data: {
      book: {
        id: updatedBook.id,
        title: updatedBook.title,
        author: updatedBook.author,
        year: updatedBook.year,
        totalPages: updatedBook.totalPages,
      },
    },
  });
};

export { updateBook };
