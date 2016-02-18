var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var qt   = require('quickthumb');


mongoose.connect('mongodb://localhost/challengeMeDB');

var login = require('./routes/login');
var categories = require('./routes/categories');
var locations = require('./routes/locations');
var profile = require('./routes/profile');
var challenge = require('./routes/challenge');


var app = express();
app.use(qt.static(__dirname + '/'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));
app.use('/node_modules', express.static(path.join(__dirname + '/node_modules')));

app.use('/', login);
app.use('/categories', categories);
app.use('/locations', locations);
app.use('/profile', profile);
app.use('/challenge', challenge);


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

app.listen("8123",function(){
	console.info("server started...");
});

module.exports = app;
