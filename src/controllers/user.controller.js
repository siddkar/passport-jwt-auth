import { User as UserModel } from '../models';
import { ErrorHandler, AppConstants, ResponseEntity } from '../utils';

const getProfile = async (req, res, next) => {
    try {
        /* eslint-disable no-underscore-dangle */
        const user = await UserModel.findOne({ _id: req.user._id }, {
            firstName: 1,
            middleName: 1,
            lastName: 1,
            phone: 1,
            _id: 0,
        });
        return res.status(AppConstants.httpStatus.ok).json({
            ...ResponseEntity(
                AppConstants.successCode.genericSuccess,
                AppConstants.httpStatus.ok,
                AppConstants.successMsgs.genericMsg,
            ),
            entity: user,
        });
    } catch (error) {
        const genericError = ErrorHandler.genericErrorHandler(error, 'user.controller.getProfile');
        return next(genericError);
    }
};

const UserController = {
    getProfile,
};

export default UserController;
