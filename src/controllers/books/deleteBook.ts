import { type Request, type Response } from 'express';
import prisma from '../../../prisma/prisma';
import { RequestError } from '../../helpers';

const deleteBook = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const { id: userId } = req.user;

  const existingBook = await prisma.book.findUnique({
    where: { id },
  });

  if (!existingBook) {
    throw RequestError(404, `Book with id ${id} not found`);
  }

  if (existingBook.userId !== userId) {
    throw RequestError(403, 'Forbidden: This book does not belong to you');
  }

  if (existingBook.status === 'READING') {
    throw RequestError(
      400,
      'Cannot delete a book that is currently being read',
    );
  }

  await prisma.book.delete({
    where: { id },
  });
  res.status(200).json({
    status: 'success',
    message: 'Book deleted successfully',
  });
};

export { deleteBook };
