import { Router } from 'express';
import { AuthMiddleware } from '../middlewares';
import { UserController } from '../controllers';

const userRouter = new Router();

userRouter.get('/user/profile', AuthMiddleware.authCallback, UserController.getProfile);

export default userRouter;
