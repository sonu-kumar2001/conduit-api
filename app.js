var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
let db = require("./db/config");

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
let profileRouter = require("./routes/profile");

const auth = require('./modules/config');

//connect to database
db.connect();

var app = express();

//.env
require("dotenv").config();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(auth.currentUserLoggedIn);

app.use('/api/', indexRouter);
app.use('/api/users', usersRouter);
app.use('/api/profiles',profileRouter);
app.use('/api/articles',require("./routes/article"));
app.use('/api/tags',require("./routes/tags"));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json('error');
});

module.exports = app;
