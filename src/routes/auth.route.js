import { Router } from 'express';
import { AuthMiddleware } from '../middlewares';
import { AuthController } from '../controllers';

const authRouter = new Router();

// get logged-in user profile
authRouter.post('/signup', AuthMiddleware.signupCallback);

// login user
authRouter.post('/login', AuthMiddleware.loginCallback);

// logout user
authRouter.get('/logout', AuthController.logout);

export default authRouter;
