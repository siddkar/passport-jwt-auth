const errMsgs = {
    userExists: email => `User with email: '${email}' already exists!!! Please try to login`,
    userNotFound: email => `User with email: '${email}' not found!!! Please signup`,
    unauthorizedUser: 'Incorrect password!!! Please try again or reset your password',
    genericMsg: 'Something went wrong!!!',
};

const successMsgs = {
    signupSuccess: name => `User '${name}' registered successfully!!!`,
    loginSuccess: name => `User '${name}' logged in successfully!!!`,
};

const errorCode = {
    userExists: 'E_USER_EXISTS',
    genericErr: 'E_GENERIC_ERROR',
    userNotFound: 'E_USER_NOT_FOUND',
    unauthorizedUser: 'E_UNAUTHORIZED',
};

const successCode = {
    signupSuccess: 'S_SIGNUP_SUCCESS',
    loginSuccess: 'S_LOGIN_SUCCESS',
};

const httpStatus = {
    ok: 200,
    created: 201,
    unauthorized: 401,
    notFound: 404,
    unprocessableEntity: 422,
    internalServerError: 500,
};

const AppConstants = {
    errMsgs,
    successMsgs,
    errorCode,
    successCode,
    httpStatus,
};

export default AppConstants;
