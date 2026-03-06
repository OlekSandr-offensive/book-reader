import { type Request, type Response } from 'express';
import prisma from '../../../prisma/prisma';
import { RequestError } from '../../helpers';

const getBookById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await prisma.book.findUnique({ where: { id: Number(id) } });
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
