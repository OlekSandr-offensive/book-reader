import express from 'express';
import { ctrlWrapper } from '../../helpers';
import {
  logout,
  login,
  signup,
  refreshToken,
  currentUser,
} from '../../controllers/auth';
import { authenticate, validationBody } from '../../middlewares';
import { registerSchema, loginSchema, refreshTokenSchema } from '../../schemas';

const router = express.Router();

router.post('/login', validationBody(loginSchema), ctrlWrapper(login));

router.post(
  '/refresh',
  validationBody(refreshTokenSchema),
  ctrlWrapper(refreshToken),
);

router.post('/signup', validationBody(registerSchema), ctrlWrapper(signup));

router.post('/logout', authenticate, ctrlWrapper(logout));

router.get('/current', authenticate, ctrlWrapper(currentUser));

export default router;
