import express from 'express';
import ctrlWrapper from '../../helpers/ctrlWrapper';
import ctrl from '../../controllers/auth';
import validationBody from '../../middlewares/validationBody';
import { registerSchema, loginSchema } from '../../schemas';


const router = express.Router();

router.get('/health', ctrlWrapper(ctrl.health));

router.post('/login', validationBody(loginSchema), ctrlWrapper(ctrl.login));

router.post('/register', validationBody(registerSchema), ctrlWrapper(ctrl.register));

export default router;