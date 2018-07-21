const errMsgs = {
    userExists: email => `User with ${email} already exists!!!`,
};

const successMsgs = {
    signupSuccess: name => `User '${name}' registered successfully!!!`,
};

const AppConstants = {
    errMsgs,
    successMsgs,
};

export default AppConstants;
