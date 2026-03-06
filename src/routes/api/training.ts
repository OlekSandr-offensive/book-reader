import express from 'express';
import { ctrlWrapper } from '../../helpers';
import {
  startTraining,
  getCurrentTraining,
  addDailyProgress,
  getTrainingStats,
} from '../../controllers/training';
import { authenticate, validationBody } from '../../middlewares';
import { trainingSchema, addDailyProgressSchema } from '../../schemas';

const router = express.Router();

router.get('/current', authenticate, ctrlWrapper(getCurrentTraining));

router.get('/:id/stats', authenticate, ctrlWrapper(getTrainingStats));

router.post(
  '/start',
  authenticate,
  validationBody(trainingSchema),
  ctrlWrapper(startTraining),
);

router.post(
  '/progress',
  authenticate,
  validationBody(addDailyProgressSchema),
  ctrlWrapper(addDailyProgress),
);

export default router;
