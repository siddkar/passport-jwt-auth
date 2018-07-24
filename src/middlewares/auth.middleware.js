import passport from 'passport';
import jwt from 'jsonwebtoken';
import { ErrorHandler, ResponseEntity, AppConstants } from '../utils';

const session = false;

const signupCallback = async (req, res) => {
    passport.authenticate('signup', async (err, success) => {
        try {
            if (err) {
                const error = await err;
                res.status(error.status).json(error);
            } else {
                const user = await success;
                res.status(user.status).json(user);
            }
        } catch (error) {
            const genericError = ErrorHandler.genericErrorHandler(error, 'user.controller.signupCallback');
            res.status(genericError.status).json(genericError);
        }
    })(req, res);
};

const loginCallback = async (req, res) => {
    passport.authenticate('login', async (err, success) => {
        try {
            if (err) {
                const error = await err;
                res.status(error.status).json(error);
            } else {
                const user = await success;
                req.login(user, { session }, async () => {
                    /* eslint-disable no-underscore-dangle */
                    const data = { _id: user._id, email: user.email };
                    try {
                        const token = await jwt.sign({ data }, process.env.SECRET_KEY);
                        const responseEntity = ResponseEntity(
                            AppConstants.successCode.loginSuccess,
                            AppConstants.httpStatus.ok,
                            AppConstants.successMsgs.loginSuccess(user.firstName),
                        );
                        res.status(responseEntity.status).json({ ...responseEntity, token });
                    } catch (error) {
                        const genericError = ErrorHandler.genericErrorHandler(error, 'user.controller.loginCallback');
                        res.status(genericError.status).json(genericError);
                    }
                });
            }
        } catch (error) {
            const genericError = ErrorHandler.genericErrorHandler(error, 'user.controller.loginCallback');
            res.status(genericError.status).json(genericError);
        }
    })(req, res);
};

const AuthMiddleware = {
    signupCallback,
    loginCallback,
};

export default AuthMiddleware;
