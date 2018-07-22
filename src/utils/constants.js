const errMsgs = {
    userExists: email => `User with email: '${email}' already exists!!!`,
    genericMsg: 'Something went wrong!!!',
};

const successMsgs = {
    signupSuccess: name => `User '${name}' registered successfully!!!`,
};

const responseCodes = {
    userExists: 'E_USER_EXISTS',
    signupSuccess: 'S_USER_SUCCESS',
    genericErr: 'E_GENERIC_ERROR',
};

const AppConstants = {
    errMsgs,
    successMsgs,
    responseCodes,
};

export default AppConstants;
