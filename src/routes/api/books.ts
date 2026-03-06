import express from 'express';
import { ctrlWrapper } from '../../helpers';
import {
  addBook,
  getBooks,
  getBookById,
  updateBook,
  deleteBook,
  getBookProgress,
  addBookReview,
} from '../../controllers/books';
import { authenticate, isValidId, validationBody } from '../../middlewares';
import {
  addBookSchema,
  updateBookSchema,
  addBookReviewSchema,
} from '../../schemas';

const router = express.Router();

router.get('/', authenticate, ctrlWrapper(getBooks));

router.get('/:id', isValidId, ctrlWrapper(getBookById));

router.get('/:id/progress', isValidId, ctrlWrapper(getBookProgress));

router.patch(
  '/:id',
  authenticate,
  isValidId,
  validationBody(updateBookSchema),
  ctrlWrapper(updateBook),
);

router.patch(
  '/:id/review',
  authenticate,
  isValidId,
  validationBody(addBookReviewSchema),
  ctrlWrapper(addBookReview),
);

router.delete('/:id', authenticate, isValidId, ctrlWrapper(deleteBook));

router.post(
  '/',
  authenticate,
  validationBody(addBookSchema),
  ctrlWrapper(addBook),
);

export default router;
