const express = require('express');
const router  = express.Router();
const jwt = require('jsonwebtoken');
const passport = require("passport");
const localStrategy = require('passport-local').Strategy;
const User = require('../models/users');
const JWTstrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;

//Create a passport middleware to handle User login
passport.use('login', new localStrategy({
  usernameField : 'email',
  passwordField : 'password'
}, async (email, password, done) => {
  try {
    const user = await User.findOne({ email });
    if( !user ){
      return done(null, false, { message : 'User not found'});
    }
    const validate = await user.isValidPassword(password);
    if( !validate ){
      return done(null, false, { message : 'Wrong Password'});
    }
    return done(null, user, { message : 'Logged in Successfully'});
  } catch (error) {
    return done(error);
  }
}));

//This verifies that the token sent by the user is valid
passport.use(new JWTstrategy({
  secretOrKey : 'SSDSJDJSBNBN',
  jwtFromRequest : ExtractJWT.fromAuthHeaderAsBearerToken()
}, function(jwt_payload, done) {
  User.findOne({id: jwt_payload.sub}, function(err, user) {
      if (err) {
          return done({"error": "Invalid token"}, false);
      }
      if (user) {
          return done(null, user);
      } else {
          return done(null, false);
      }
  });
}));