import passport from 'passport';
import { logger } from '../config';
import { AppConstants, handleResponse, errorLog } from '../utils';
/* const signup = async (req, res) => {
    const signupRes = { ...req.user };
    res.status(signupRes.status).send(signupRes);
}; */

const signupCallback = async (req, res) => {
    passport.authenticate('signup', async (err, success) => {
        try {
            if (err) {
                const error = await err;
                res.status(error.status).json(err);
            } else {
                const user = await success;
                res.status(user.status).json(user);
            }
        } catch (error) {
            logger.error(errorLog('user.controller.signupCallback', AppConstants.errMsgs.genericMsg, error));
            res.status(AppConstants.httpStatus.internalServerError).json(handleResponse(
                AppConstants.responseCodes.genericErr,
                AppConstants.httpStatus.internalServerError,
                AppConstants.errMsgs.genericMsg,
            ));
        }
    })(req, res);
};

const UserController = {
    signupCallback,
};

export default UserController;
