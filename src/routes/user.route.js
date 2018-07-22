import { Router } from 'express';
import { AuthMiddleware } from '../middlewares';
import { UserController } from '../controllers';

const userRouter = new Router();

userRouter.post('/user/signup', AuthMiddleware.signup, UserController.signup);

export default userRouter;
