import ErrorHandler from './error.handler';
import AppConstants from './app.constants';

const unauthorized = (api, errMsg = AppConstants.errMsgs.unauthorizedUser) => ErrorHandler.customErrorHandler(
    api,
    AppConstants.errorCode.unauthorizedUser,
    AppConstants.httpStatus.unauthorized,
    errMsg,
);

const usernotfound = (api, email) => ErrorHandler.customErrorHandler(
    api,
    AppConstants.errorCode.userNotFound,
    AppConstants.httpStatus.notFound,
    AppConstants.errMsgs.userNotFound(email),
);

const userexists = (api, email) => ErrorHandler.customErrorHandler(
    api,
    AppConstants.errorCode.userExists,
    AppConstants.httpStatus.unprocessableEntity,
    AppConstants.errMsgs.userExists(email),
);

const ErrorUtils = {
    unauthorized,
    usernotfound,
    userexists,
};

export default ErrorUtils;
