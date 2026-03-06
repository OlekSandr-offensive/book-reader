import { type Request, type Response } from 'express';
import prisma from '../../../prisma/prisma';
import { RequestError } from '../../helpers';

const deleteBook = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { id: userId } = req.user;

  const existingBook = await prisma.book.findUnique({
    where: { id: Number(id) },
  });
  if (!existingBook) {
    throw RequestError(404, `Book with id ${id} not found`);
  }
  if (existingBook.userId !== userId) {
    throw RequestError(403, 'Forbidden: This book does not belong to you');
  }
  await prisma.book.delete({
    where: { id: Number(id) },
  });
  res.status(200).json({
    status: 'success',
    message: 'Book deleted successfully',
  });
};

export { deleteBook };
