import { Router } from 'express';
import UserRouter from './user.route';
import AuthRouter from './auth.route';

const router = new Router();
router.use(AuthRouter);
router.use(UserRouter);

export default router;
