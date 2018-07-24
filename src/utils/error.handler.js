import logError from './log.error';
import AppConstants from './constants';
import ResponseEntity from './response.entity';

const genericErrorHandler = (error, from) => {
    const genericError = ResponseEntity(
        AppConstants.errorCode.genericErr,
        AppConstants.httpStatus.internalServerError,
        AppConstants.errMsgs.genericMsg,
    );
    // logging error rather than sending through API
    logError(from, AppConstants.errorCode.genericErr, error.message);
    // returning error responseEntity
    return genericError;
};

const customErrorHandler = (from, code, status, msg) => {
    const customError = ResponseEntity(code, status, msg);
    // logging error rather than sending through API
    logError(from, code, customError);
    // returning error responseEntity
    return customError;
};

const ErrorHandler = {
    genericErrorHandler,
    customErrorHandler,
};

export default ErrorHandler;
