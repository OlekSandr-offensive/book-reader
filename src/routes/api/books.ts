import express from 'express';
import ctrlWrapper from '../../helpers/ctrlWrapper';
import ctrl from '../../controllers/books';
import validationBody from '../../middlewares/validationBody';
import { addBookSchema, updateBookSchema } from '../../schemas';

const router = express.Router();

router.post('/', validationBody(addBookSchema), ctrlWrapper(ctrl.addBook));

router.get('/', ctrlWrapper(ctrl.getBooks));

export default router;