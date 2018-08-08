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

const authCallback = async (req, res, next) => {
    passport.authenticate('auth', { session }, async (err, success, info) => {
        try {
            if (err) {
                const error = await err;
                next(error);
            }
            if (!success && info && info.message) {
                const { token } = req;
                const { user } = jwt.verify(token, process.env.SECRET_KEY, { ignoreExpiration: true });

                // jwt expired
                if (info.message.trim().toLowerCase() === 'jwt expired') {
                    try {
                        // Invalidating the token from redis
                        await redisClient.hdelAsync('active-users', user.email);
                    } catch (error) {
                        const genericError = ErrorHandler.genericErrorHandler(error, 'auth.middleware.authCallback');
                        next(genericError);
                    }
                }

                // No auth token
                // invalid signature
                // jwt malformed
                // Just unauthorized - nothing serious, so continue normally
                next(ErrorHandler.customErrorHandler(
                    'auth.middleware.authCallback',
                    AppConstants.errorCode.unauthorizedUser,
                    AppConstants.httpStatus.unauthorized,
                    AppConstants.errMsgs.unauthorizedUser,
                ));
            }
            req.user = await success;
            next();
        } catch (error) {
            const genericError = ErrorHandler.genericErrorHandler(error, 'auth.middleware.authCallback');
            next(genericError);
        }
    })(req, res, next);
};

const AuthMiddleware = {
    signupCallback,
    loginCallback,
    authCallback,
};

export default AuthMiddleware;
