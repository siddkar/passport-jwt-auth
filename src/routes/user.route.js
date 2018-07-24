import { Router } from 'express';
import { AuthMiddleware } from '../middlewares';
import { UserController } from '../controllers';

const userRouter = new Router();

userRouter.post('/user/signup', AuthMiddleware.signupCallback);

userRouter.post('/user/login', AuthMiddleware.loginCallback);

userRouter.get('/user/profile', AuthMiddleware.auth, UserController.getProfile);

export default userRouter;
