/* eslint-disable no-unused-vars */
const errorHandlerMiddleware = (err, req, res, next) => {
    res.status(err.status || 500).json(err);
};

export default errorHandlerMiddleware;
