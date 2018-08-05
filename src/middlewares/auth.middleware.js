import passport from 'passport';
import jwt from 'jsonwebtoken';
import { ErrorHandler, ResponseEntity, AppConstants } from '../utils';
import { redisClient, logger } from '../config';

const session = false;

const signupCallback = async (req, res, next) => {
    passport.authenticate('signup', async (err, success) => {
        try {
            if (err) {
                const error = await err;
                next(error);
            } else {
                const user = await success;
                res.status(user.status).json(user);
            }
        } catch (error) {
            const genericError = ErrorHandler.genericErrorHandler(error, 'auth.middleware.signupCallback');
            next(genericError);
        }
    })(req, res, next);
};

const loginCallback = async (req, res, next) => {
    passport.authenticate('login', async (err, success) => {
        try {
            if (err) {
                const error = await err;
                next(error);
            } else {
                const userData = await success;
                req.login(userData, { session }, async (error) => {
                    if (error) {
                        next(error);
                    }
                    /* eslint-disable no-underscore-dangle */
                    const data = { _id: userData._id, email: userData.email };
                    try {
                        const token = await jwt.sign({ user: data }, process.env.SECRET_KEY, { expiresIn: '1h' });
                        await redisClient.hmsetAsync('active-users', [userData.email, token]);
                        const responseEntity = ResponseEntity(
                            AppConstants.successCode.loginSuccess,
                            AppConstants.httpStatus.ok,
                            AppConstants.successMsgs.loginSuccess(userData.firstName),
                        );
                        logger.info(responseEntity);
                        res.status(responseEntity.status).json({ ...responseEntity, token });
                    } catch (e) {
                        const genericError = ErrorHandler.genericErrorHandler(e, 'auth.middleware.loginCallback');
                        next(genericError);
                    }
                });
            }
        } catch (error) {
            const genericError = ErrorHandler.genericErrorHandler(error, 'auth.middleware.loginCallback');
            next(genericError);
        }
    })(req, res, next);
};

const authCallback = passport.authenticate('auth', { session });

const AuthMiddleware = {
    signupCallback,
    loginCallback,
    authCallback,
};

export default AuthMiddleware;
