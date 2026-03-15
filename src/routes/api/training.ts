import express from 'express';
import { ctrlWrapper } from '../../helpers';
import {
  startTraining,
  getCurrentTraining,
  addDailyProgress,
  getTrainingStats,
} from '../../controllers/training';
import { authenticate, isValidId, validationBody } from '../../middlewares';
import { trainingSchema, addDailyProgressSchema } from '../../schemas';

const router = express.Router();

router.get('/current', authenticate, ctrlWrapper(getCurrentTraining));

router.get(
  '/:id/stats',
  authenticate,
  isValidId,
  ctrlWrapper(getTrainingStats),
);

router.post(
  '/',
  authenticate,
  validationBody(trainingSchema),
  ctrlWrapper(startTraining),
);

router.post(
  '/:id/progress',
  authenticate,
  isValidId,
  validationBody(addDailyProgressSchema),
  ctrlWrapper(addDailyProgress),
);

export default router;
