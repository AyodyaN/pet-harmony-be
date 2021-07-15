const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;

const fbLogin = () => {
    passport.serializeUser(function(user, done) {
        done(null, user);
    });
    passport.deserializeUser(function(user, done) {
        done(null, user);
    });

    passport.use(new FacebookStrategy({
        clientID: process.env.YOUR_FACEBOOK_CLIENT_ID,
        clientSecret: process.env.YOUR_FACEBOOK_APP_SECRET,
        callbackURL: `${process.env.FACEBOOK_CALLBACK_URL}`,
    },

        function(accessToken, refreshToken, profile, done) {
            return done(null, profile);
        }
    ));
}

module.exports = {
    fbLogin
}
