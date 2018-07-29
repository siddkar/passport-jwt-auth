import passport from 'passport';
import jwt from 'jsonwebtoken';
import { ErrorHandler, ResponseEntity, AppConstants } from '../utils';
import { redisClient } from '../config';

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
                const user = await success;
                req.login(user, { session }, async (error) => {
                    if (error) {
                        next(error);
                    }
                    /* eslint-disable no-underscore-dangle */
                    const data = { _id: user._id, email: user.email };
                    try {
                        const activeToken = await redisClient.hgetAsync('active-users', user.email);
                        if (activeToken) {
                            redisClient.saddAsync('blacklisted-tokens', activeToken)
                                .then(result => result)
                                .catch(e => ErrorHandler.genericErrorHandler(e, 'auth.middleware.loginCallback'));
                        }
                        const token = await jwt.sign({ user: data }, process.env.SECRET_KEY, { expiresIn: '1h' });
                        const responseEntity = ResponseEntity(
                            AppConstants.successCode.loginSuccess,
                            AppConstants.httpStatus.ok,
                            AppConstants.successMsgs.loginSuccess(user.firstName),
                        );
                        redisClient.hmsetAsync('active-users', [user.email, token])
                            .then(result => result)
                            .catch(e => ErrorHandler.genericErrorHandler(e, 'auth.middleware.loginCallback'));
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
