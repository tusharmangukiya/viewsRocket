var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
const DATABASE = require("./middlewares/database");
const { getSuccessResponse, getErrorResponse, removeFields, isValidId } = require('./utils/helper');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', "ejs");
const routes= require('./routes');
const config = require('./config');

// DB Connection

require('./auth/auth');
app.use( bodyParser.urlencoded({ extended : false }) );

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/static',express.static(path.join(__dirname, 'public')));
app.use('/lib',express.static(path.join(__dirname, 'node_modules')));
DATABASE.connect();

// Routes
app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// Handle invalid JWT
app.use(function(err, req, res, next) {
  if (err.constructor.name === 'UnauthorizedError') {
    const bearerHeader = req.headers['authorization'];  // Get auth header value
    if(typeof bearerHeader !== 'undefined') { // Check if bearer is undefined
      // Unauthorized
      res.status(401).send(getErrorResponse("Invalid token given!"));
    } else {
      // Forbidden
      res.status(403).send(getErrorResponse("Forbidden!"));
    }    
  }
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json(err);
});

module.exports = app;
