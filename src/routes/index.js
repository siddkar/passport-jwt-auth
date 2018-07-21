import { Router } from 'express';
import UserRouter from './user.route';

const router = new Router();
router.use(UserRouter);

export default router;
