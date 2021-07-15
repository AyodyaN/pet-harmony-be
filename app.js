const express = require('express');
const cors = require('cors');
const { graphqlHTTP } = require('express-graphql');
// const schema = require('./app/schema/schema');
const schema = require('./app/schema/schema1');
const dotenv = require("dotenv");
const connectDB = require('./app/resources/mongodb/connection');
// var passport = require("passport");
const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const cookieSession = require('cookie-session')
// const FacebookStrategy = require('passport-facebook');
const uuid = require('uuid');
const UserModel = require('./app/model/user-model');
const isLoggedIn = require('./app/middleware/auth')
// require('./app/src/login/fb-login');

// Get env configurations
dotenv.config({ path: `./app/config/${process.env.NODE_ENV}.env` });

const PORT = process.env.PORT;
const MODE = process.env.NODE_ENV;

connectDB();

const app = express();

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
    console.log("=========", profile);
    return done(null, profile);
  }
  ));
  
  passport.use(new GoogleStrategy({
    clientID: process.env.YOUR_GOOGLE_CLIENT_ID,
    clientSecret: process.env.YOUR_GOOGLE_APP_SECRET,
    callbackURL: `${process.env.GOOGLE_CALLBACK_URL}`
  },
  
  function(accessToken, refreshToken, profile, done) {
    console.log("=========11111", profile);
    return done(null, profile);
}
));

app.use(cookieSession({
  name: 'facebook-auth-session',
  keys: ['key1', 'key2']
}))
app.use(cookieSession({
  name: 'google-auth-session',
  keys: ['key1', 'key2']
}))
app.use(passport.initialize());
app.use(passport.session());

app.get('/',isLoggedIn,(req,res)=>{
  res.send(`Welcome ${req.user.displayName}`)
})
app.get('/auth/error', (req, res) => res.send('Unknown Error'))
app.get('/auth/facebook',passport.authenticate('facebook'));
app.get('/auth/facebook/callback',passport.authenticate('facebook', { failureRedirect: '/login' }),
function(req, res) {
   res.redirect('/');
});
app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
app.get('/auth/error', (req, res) => res.send('Unknown Error'))
app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/auth/error' }),
  function(req, res) {
    res.redirect('/');
  }
);
app.get('/',isLoggedIn,(req,res)=>{
  res.send(`Welcome ${req.user.displayName}`)
})

app.get('/auth/facebook/logout', (req, res) => {
  req.session = null;
  req.logout();
  res.redirect('/');
})

app.get('/auth/google/logout', (req, res) => {
  req.session = null;
  req.logout();
  res.redirect('/');
})

app.use('/graphql', graphqlHTTP({
    schema,
    graphiql: true
}));

app.use(cors());

app.listen(PORT, () => { console.log(`Server is running in ${MODE} mode on port ${PORT}`) });
