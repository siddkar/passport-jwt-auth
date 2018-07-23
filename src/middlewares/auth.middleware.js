import passport from 'passport';
import { ExtractJwt, Strategy as JwtStrategy } from 'passport-jwt';
import LocalStrategy from 'passport-local';
import { User } from '../models';
import { AppConstants, handleResponse } from '../utils';

const session = false;
const passReqToCallback = true;

const jwtOptions = {
    secretOrKey: process.env.SECRET_KEY,
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
};

const signupStrategy = new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback,
}, async (req, email, password, done) => {
    const user = { ...req.body };
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return done(null, handleResponse(
                AppConstants.responseCodes.userExists,
                AppConstants.httpStatus.ok,
                AppConstants.errMsgs.userExists(user.email),
            ));
        }
        const registeredUser = await User.create(user);
        return done(null, {
            ...handleResponse(
                AppConstants.responseCodes.signupSuccess,
                AppConstants.httpStatus.created,
                AppConstants.successMsgs.signupSuccess(user.firstName),
            ),
            registeredUser,
        });
    } catch (error) {
        return done(null, {
            ...handleResponse(
                AppConstants.responseCodes.genericErr,
                AppConstants.httpStatus.internalServerError,
                AppConstants.errMsgs.genericMsg,
            ),
            ...error,
        });
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
