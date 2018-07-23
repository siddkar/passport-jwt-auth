import { Router } from 'express';
import { UserController } from '../controllers';

const userRouter = new Router();

userRouter.post('/user/signup', UserController.signupCallback);

export default userRouter;
