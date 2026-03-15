import { type Request, type Response } from 'express';
import prisma from '../../../prisma/prisma';
import { RequestError } from '../../helpers';

const getBookById = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const { id: owner } = req.user;
  const result = await prisma.book.findUnique({
    where: { id, userId: Number(owner) },
  });
  if (!result) {
    throw RequestError(404, `Book with id ${id} not found`);
  }
  res.status(200).json({
    status: 'success',
    data: {
      book: result,
    },
  });
};

export { getBookById };
