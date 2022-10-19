var createError = require('http-errors');
var express = require('express');
var path = require('path');
var session = require('express-session')
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var users = require('./routes/users');
var apropos = require('./routes/apropos');
var connect = require('./routes/connect');
var activities = require('./routes/activities');
var upload = require('./routes/upload');
var disconnect = require('./routes/disconnect');
var user_add = require('./routes/user_add');
var user_update = require('./routes/user_update');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(session({ secret: 'session', resave: false, saveUninitialized: true, }));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users',users);
app.use('/apropos',apropos);
app.use('/connect',connect);
app.use('/activities', activities);
app.use('/upload',upload);
app.use('/disconnect',disconnect);
app.use('/user_add', user_add);
app.use('/user_update', user_update);

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
  res.render('error');
});

module.exports = app;
