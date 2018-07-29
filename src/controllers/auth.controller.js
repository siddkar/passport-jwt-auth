import { redisClient } from '../config';
import { ErrorHandler } from '../utils';

const logout = async (req, res) => {
    const { token } = req;
    redisClient.saddAsync('blacklisted-tokens', token)
        .then(result => result)
        .catch(e => ErrorHandler.genericErrorHandler(e, 'auth.controller.logout'));
    req.logout();
    res.redirect('/api');
};

const AuthController = {
    logout,
};

export default AuthController;
