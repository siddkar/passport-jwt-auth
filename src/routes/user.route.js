import { Router } from 'express';
import passport from 'passport';

const jwtSession = false;

const userRouter = new Router();

userRouter.post('/user/signup', passport.authenticate('signup', { jwtSession }));

export default userRouter;
