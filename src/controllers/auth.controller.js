import jwt from 'jsonwebtoken';
import { redisClient, logger } from '../config';
import { ErrorHandler } from '../utils';

const logout = async (req, res, next) => {
    const { token } = req;
    const { user } = jwt.verify(token, process.env.SECRET_KEY);
    try {
        // Remove the user from active-users
        await redisClient.hdelAsync('active-users', user.email);
        logger.info({ message: `${user.email} logged out successfully!!!` });
    } catch (error) {
        const genericError = ErrorHandler.genericErrorHandler(error, 'auth.controller.logout');
        next(genericError);
    }
    req.logout();
    res.redirect('/api');
};

const AuthController = {
    logout,
};

export default AuthController;
