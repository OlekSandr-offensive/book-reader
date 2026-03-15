import { type Request, type Response } from 'express';
import prisma from '../../../prisma/prisma';
import { RequestError } from '../../helpers';

const addDailyProgress = async (req: Request, res: Response) => {
  const { id: userId } = req.user;
  const trainingId = Number(req.params.id);
  const { bookId, pagesRead } = req.body;

  const trainingBook = await prisma.trainingBook.findUnique({
    where: {
      trainingId_bookId: { trainingId, bookId },
    },
    select: {
      isFinished: true,
      countReadPage: true,
      book: {
        select: { totalPages: true },
      },
    },
  });

  if (!trainingBook) {
    throw RequestError(404, 'Training not found');
  }

  if (trainingBook.isFinished) {
    throw RequestError(
      400,
      'Book is already marked as finished in this training',
    );
  }

  if (!trainingBook.book) {
    throw RequestError(404, 'Book not found');
  }

  const countPage = trainingBook.countReadPage + pagesRead;
  const totalPages = trainingBook.book.totalPages;

  if (countPage > totalPages) {
    throw RequestError(
      400,
      `Pages read cannot exceed total pages of the book (${totalPages})`,
    );
  }

  await prisma.trainingBook.update({
    where: {
      trainingId_bookId: { trainingId, bookId },
    },
    data: {
      countReadPage: { increment: pagesRead },
    },
  });

  const now = new Date();

  const progress = await prisma.dailyProgress.create({
    data: {
      userId,
      trainingId,
      bookId,
      pagesRead,
      date: now,
    },
  });

  let bookFinished = false;
  let trainingFinished = false;

  if (countPage >= totalPages) {
    bookFinished = true;

    await prisma.trainingBook.update({
      where: {
        trainingId_bookId: {
          trainingId,
          bookId,
        },
      },
      data: {
        isFinished: true,
        book: {
          update: { status: 'DONE' },
        },
      },
    });

    const remainingBooks = await prisma.trainingBook.count({
      where: { trainingId, isFinished: false },
    });

    if (remainingBooks === 0) {
      trainingFinished = true;

      await prisma.training.update({
        where: { id: trainingId },
        data: { status: 'COMPLETED' },
      });
    }
  }

  return res.status(200).json({
    status: 'success',
    trainingFinished,
    bookFinished,
    data: { progress },
  });
};

export { addDailyProgress };
