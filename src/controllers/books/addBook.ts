import { type Request, type Response } from 'express';
import  prisma  from "../../../prisma/prisma";


const addBook = async (req: Request, res: Response) => {
   const { title, author, year, text, owner } = req.body;

  const book = await prisma.book.create({
    data: {
      title,
      author,
      year,
      text,
      userId: owner,
    },
  });

  res.status(201).json({
    message: 'Book added successfully',
    data: {
      book,
    }
  });
}

export default addBook;