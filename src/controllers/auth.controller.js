import jwt from 'jsonwebtoken';
import { redisClient, logger } from '../config';
import { ErrorHandler, ErrorUtils, AppConstants } from '../utils';

const logout = async (req, res, next) => {
    try {
        const { token } = req;
        const { user } = jwt.verify(token, process.env.SECRET_KEY);
        // Remove the user from active-users
        const isActive = await redisClient.hdelAsync('active-users', user.email);
        if (isActive) {
            logger.info({ message: `${user.email} logged out successfully!!!` });
            req.logout();
            res.redirect('/api');
        } else {
            next(ErrorUtils.unauthorized('auth.middleware.authCallback', AppConstants.errMsgs.sessionExpired));
        }
    } catch (error) {
        if (error.message.trim().toLowerCase() === 'jwt expired') {
            next(ErrorUtils.unauthorized('auth.middleware.authCallback', AppConstants.errMsgs.sessionExpired));
        }
        const genericError = ErrorHandler.genericErrorHandler(error, 'auth.controller.logout');
        next(genericError);
    }
};

const AuthController = {
    logout,
};

export default AuthController;
