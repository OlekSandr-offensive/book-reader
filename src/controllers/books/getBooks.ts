import { type Request, type Response } from 'express';
import prisma from '../../../prisma/prisma';
import { RequestError } from '../../helpers';

const getBooks = async (req: Request, res: Response) => {
  const { id: owner } = req.user;
  const { page = 1, limit = 20 } = req.query;
  const userId = Number(owner);
  const pageNum = Number(page) || 1;
  const limitNum = Number(limit) || 20;
  const skip = (pageNum - 1) * limitNum;

  if (!owner || Number.isNaN(userId)) {
    throw RequestError(400, 'Invalid user ID');
  }
  const books = await prisma.book.findMany({
    skip,
    take: limitNum,
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });

  const totalBooks = await prisma.book.count({ where: { userId } });

  res.status(200).json({
    status: 'success',
    data: {
      books: books.map((book) => ({
        id: book.id,
        title: book.title,
        author: book.author,
        year: book.year,
        totalPages: book.totalPages,
        status: book.status,
      })),
    },
    meta: {
      total: totalBooks,
      page: pageNum,
      limit: limitNum,
      hasNextPage: skip + books.length < totalBooks,
    },
  });
};

export { getBooks };
