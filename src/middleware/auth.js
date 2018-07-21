import passport from 'passport';
import { ExtractJwt, Strategy as JwtStrategy } from 'passport-jwt';
import LocalStrategy from 'passport-local';
import { User } from '../models';
import { AppConstants } from '../utils';

const jwtOptions = {
    secretOrKey: process.env.SECRET_KEY,
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
};

const signup = new LocalStrategy({
    session: false,
    passReqToCallback: true,
}, async (req, res) => {
    const user = { ...req.body.user };
    try {
        const existingUser = await User.findOne({ email: user.email });
        if (existingUser) {
            res.status(422).json({ message: AppConstants.errMsgs.userExists(user.email) });
        } else {
            const registeredUser = await User.create(user);
            res.status(201).json({
                message: AppConstants.successMsgs.signupSuccess(user.firstName),
                registeredUser,
            });
        }
    } catch (err) {
        res.status(500).json(err);
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

passport.use('signup', signup);
passport.use('validateToken', validateToken);

const initialize = () => passport.initialize();

const auth = {
    initialize,
};

export default auth;
