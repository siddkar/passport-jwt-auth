import passport from 'passport';
import { ExtractJwt, Strategy as JwtStrategy } from 'passport-jwt';
import LocalStrategy from 'passport-local';
import { User } from '../models';
import { AppConstants, handleResponse } from '../utils';
import { logger } from '../config';

const session = false;
const passReqToCallback = true;

const jwtOptions = {
    secretOrKey: process.env.SECRET_KEY,
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
};

const localStrategyOptions = {
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback,
};

const signupStrategy = new LocalStrategy(localStrategyOptions, async (req, email, password, done) => {
    const user = { ...req.body };
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            const existingUserErr = handleResponse(
                AppConstants.responseCodes.userExists,
                AppConstants.httpStatus.unprocessableEntity,
                AppConstants.errMsgs.userExists(user.email),
            );
            logger.error({ type: AppConstants.responseCodes.userExists, existingUserErr });
            return done(null, existingUserErr);
        }
        const newUser = await User.create(user);
        return done(null, {
            ...handleResponse(
                AppConstants.responseCodes.signupSuccess,
                AppConstants.httpStatus.created,
                AppConstants.successMsgs.signupSuccess(user.firstName),
            ),
            newUser,
        });
    } catch (err) {
        // logging error rather than sending through API
        logger.error({ type: AppConstants.errMsgs.genericMsg, err });
        const genericError = handleResponse(
            AppConstants.responseCodes.genericErr,
            AppConstants.httpStatus.internalServerError,
            AppConstants.errMsgs.genericMsg,
        );
        return done(null, genericError);
    }
});

const validateToken = new JwtStrategy(jwtOptions, async (payload, done) => {
    let user = {};
    try {
        user = await User.find({ username: payload.username });
    } catch (err) {
        return done(new Error('Incorrect username or password!!!'), null);
    }
    if (user) {
        return done(null, user);
    }
    return done(new Error('Incorrect username or password!!!'), null);
});

passport.use('signup', signupStrategy);
passport.use('validateToken', validateToken);

const initialize = () => passport.initialize();
const signup = passport.authenticate('signup', { session });

const AuthMiddleware = {
    initialize,
    signup,
};

export default AuthMiddleware;
