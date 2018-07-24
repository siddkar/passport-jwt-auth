import { Router } from 'express';
import { AuthMiddleware } from '../middlewares';

const userRouter = new Router();

userRouter.post('/user/signup', AuthMiddleware.signupCallback);

userRouter.post('/user/login', AuthMiddleware.loginCallback);

export default userRouter;
