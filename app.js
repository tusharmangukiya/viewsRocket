const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors')
const passport = require('passport');
const session = require('express-session');
const favicon = require('serve-favicon');
const { getErrorResponse } = require('./utils/helper');
const { sess } = require("./config");
const DATABASE = require("./middlewares/database"); 
const { task , cronStatusReset } = require("./services/cron");
const ADMIN = require("./seeder/admin")
const routes= require('./routes');

task.start();
cronStatusReset.start();

const app = express();

app.use(cors());
app.use(session(sess));
app.use(passport.initialize());
app.use(passport.session());

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', "ejs");

// DB Connection
DATABASE.connect();
ADMIN.addAdmin();
require('./middlewares/passport');

app.use(logger('dev'));
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended : true }));
app.use(cookieParser());
app.use('/static',express.static(path.join(__dirname, 'public')));
app.use('/lib',express.static(path.join(__dirname, 'node_modules')));
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

// Routes
app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  res.status(400).json(getErrorResponse("Bad Request!"));
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
