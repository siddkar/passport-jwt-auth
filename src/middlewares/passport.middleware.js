import passport from 'passport';
// import { ExtractJwt, Strategy as JwtStrategy } from 'passport-jwt';
import LocalStrategy from 'passport-local';
import { User as UserModel } from '../models';
import { AppConstants, ResponseEntity, ErrorHandler } from '../utils';

const passReqToCallback = true;

/* const jwtOptions = {
    secretOrKey: process.env.SECRET_KEY,
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
}; */

const localStrategyOptions = {
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback,
};

const signupStrategy = new LocalStrategy(localStrategyOptions, async (req, email, password, done) => {
    const user = { ...req.body };
    try {
        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
            return done(ErrorHandler.customErrorHandler(
                'auth.signupStrategy',
                AppConstants.errorCode.userExists,
                AppConstants.httpStatus.unprocessableEntity,
                AppConstants.errMsgs.userExists(user.email),
            ));
        }
        const newUser = await UserModel.create(user);
        /* eslint-disable no-underscore-dangle */
        return done(null, {
            ...ResponseEntity(
                AppConstants.successCode.signupSuccess,
                AppConstants.httpStatus.created,
                AppConstants.successMsgs.signupSuccess(newUser.firstName),
            ),
        });
    } catch (error) {
        return done(ErrorHandler.genericErrorHandler(error, 'auth.signupStrategy'));
    }
});

const loginStrategy = new LocalStrategy(localStrategyOptions, async (req, email, password, done) => {
    try {
        const user = await UserModel.findOne({ email });
        if (!user) {
            return done(ErrorHandler.customErrorHandler(
                'auth.loginStrategy',
                AppConstants.errorCode.userNotFound,
                AppConstants.httpStatus.notFound,
                AppConstants.errMsgs.userNotFound(email),
            ));
        }
        const validate = await user.isValidPassword(password);
        if (!validate) {
            return done(ErrorHandler.customErrorHandler(
                'auth.loginStrategy',
                AppConstants.errorCode.unauthorizedUser,
                AppConstants.httpStatus.unauthorized,
                AppConstants.errMsgs.unauthorizedUser,
            ));
        }
        return done(null, user);
    } catch (error) {
        return done(ErrorHandler.genericErrorHandler(error, 'auth.loginStrategy'));
    }
});

passport.use('signup', signupStrategy);
passport.use('login', loginStrategy);

const initialize = () => passport.initialize();

const PassportMiddleware = {
    initialize,
};

export default PassportMiddleware;