import passport from 'passport';
import jwt from 'jsonwebtoken';
import {
    ErrorHandler, ResponseEntity, AppConstants, ErrorUtils,
} from '../utils';
import { redisClient } from '../config';

const session = false;

const signupCallback = async (req, res, next) => {
    passport.authenticate('signup', async (err, success) => {
        try {
            if (err) {
                return next(err);
            }
            const user = success;
            return res.status(user.status).json(user);
        } catch (error) {
            const genericError = ErrorHandler.genericErrorHandler(error, 'auth.middleware.signupCallback');
            return next(genericError);
        }
    })(req, res, next);
};

const loginCallback = async (req, res, next) => {
    passport.authenticate('login', async (err, success) => {
        req.login(success, { session }, async () => {
            if (err) {
                return next(err);
            }
            /* eslint-disable no-underscore-dangle */
            const data = { _id: success._id, email: success.email };
            try {
                const token = await jwt.sign({ user: data }, process.env.SECRET_KEY, { expiresIn: '1h' });
                await redisClient.hmsetAsync('active-users', [data.email, token]);
                const responseEntity = ResponseEntity(
                    AppConstants.successCode.loginSuccess,
                    AppConstants.httpStatus.ok,
                    AppConstants.successMsgs.loginSuccess(success.firstName),
                );
                return res.status(responseEntity.status).json({ ...responseEntity, token });
            } catch (error) {
                const genericError = ErrorHandler.genericErrorHandler(error, 'auth.middleware.loginCallback');
                return next(genericError);
            }
        });
    })(req, res, next);
};

const authCallback = async (req, res, next) => {
    passport.authenticate('auth', { session }, async (err, success, info) => {
        try {
            if (err) {
                return next(err);
            }
            if (!success) {
                if (info && info.message) {
                    const { token } = req;
                    const { user } = jwt.verify(token, process.env.SECRET_KEY, { ignoreExpiration: true });
                    // jwt expired
                    if (info.message.trim().toLowerCase() === 'jwt expired') {
                        try {
                            // Invalidating the token from redis
                            await redisClient.hdelAsync('active-users', user.email);
                        } catch (error) {
                            const genericError = ErrorHandler.genericErrorHandler(error, 'auth.middleware.authCallback');
                            return next(genericError);
                        }
                        return next(ErrorUtils.unauthorized('auth.middleware.authCallback', AppConstants.errMsgs.sessionExpired));
                    }
                }
                // jwt must be provided, invalid signature, jwt malformed
                return next(ErrorUtils.unauthorized('auth.middleware.authCallback'));
            }
            req.user = success;
            return next();
        } catch (error) {
            const genericError = ErrorHandler.genericErrorHandler(error, 'auth.middleware.authCallback');
            return next(genericError);
        }
    })(req, res, next);
};

const AuthMiddleware = {
    signupCallback,
    loginCallback,
    authCallback,
};

export default AuthMiddleware;
