import { type Request, type Response } from 'express';
import  prisma  from "../../../prisma/prisma";
import RequestError from '../../helpers/RequestError';


const getBooks = async (req: Request, res: Response) => {
    const { owner, page = '1', limit = '10' } = req.query;

  const userId = Number(owner);
  const pageNum = Number(page) || 1;
  const limitNum = Number(limit) || 10;
  const skip = (pageNum - 1) * limitNum;

if (!owner || Number.isNaN(userId)) {
  throw RequestError(400, 'Owner query parameter is required and must be a number');
}
    const books = await prisma.book.findMany({
    skip,
    take: limitNum,
    where: { userId },
    orderBy: { createdAt: 'desc' },
    });
  
  const totalBooks = await prisma.book.count({ where: { userId } });

  res.status(200).json({
    message: 'Books retrieved successfully',
    data: { 
      books, 
      pagination: {
        total: totalBooks,
        page: pageNum,
        limit: limitNum,
        hasNextPage: skip + books.length < totalBooks
      }
    },
  });
 };

export default getBooks;