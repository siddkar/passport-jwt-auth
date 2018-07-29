import { Router } from 'express';
import { AuthMiddleware } from '../middlewares';
import { AuthController } from '../controllers';

const authRouter = new Router();

authRouter.post('/signup', AuthMiddleware.signupCallback);

authRouter.post('/login', AuthMiddleware.loginCallback);

authRouter.get('/logout', AuthController.logout);

export default authRouter;
