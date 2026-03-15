import { type Request, type Response } from 'express';
import prisma from '../../../prisma/prisma';
import { RequestError } from '../../helpers';

const updateBook = async (req: Request, res: Response) => {
  const bookID = Number(req.params.id);
  const { id: userId } = req.user;
  const { title, author, year, totalPages } = req.body;

  const existingBook = await prisma.book.findUnique({
    where: { id: bookID },
  });
  if (!existingBook) {
    throw RequestError(404, `Book with id ${bookID} not found`);
  }
  if (existingBook.userId !== userId) {
    throw RequestError(403, 'Forbidden: This book does not belong to you');
  }
  const updatedBook = await prisma.book.update({
    where: { id: bookID },
    data: {
      title: title ?? undefined,
      author: author ?? undefined,
      year: year !== undefined && year !== null ? Number(year) : undefined,
      totalPages:
        totalPages !== undefined && totalPages !== null
          ? Number(totalPages)
          : undefined,
    },
  });
  res.status(200).json({
    status: 'success',
    message: 'Book updated successfully',
    data: {
      book: { updatedBook },
    },
  });
};

export { updateBook };
