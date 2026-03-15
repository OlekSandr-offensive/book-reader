import { type Request, type Response } from 'express';
import prisma from '../../../prisma/prisma';

const addBook = async (req: Request, res: Response) => {
  const { id: userId } = req.user;
  const { title, author, year, totalPages } = req.body;

  const book = await prisma.book.create({
    data: {
      title,
      author,
      year: Number(year),
      totalPages: Number(totalPages),
      userId,
    },
  });

  res.status(201).json({
    status: 'success',
    message: 'Book created',
    data: { book },
  });
};

export { addBook };
