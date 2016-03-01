var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var qt   = require('quickthumb');
var session = require('client-sessions');
var busboy = require('connect-busboy');

mongoose.connect('mongodb://localhost/challengeMeDB');

var login = require('./routes/login');
var categories = require('./routes/categories');
var locations = require('./routes/locations');
var profile = require('./routes/profile');
var challenge = require('./routes/challenge');
var subcribeChallenge = require('./routes/subcribeChallenge');
var solution = require('./routes/solution');
var mailUtil = require('./routes/mailRoute');
var contactUs = require('./routes/contactUs');


var app = express();


/*try {
	  config = require(config_file);
	} catch (err) {
	  if (err.code && err.code === 'MODULE_NOT_FOUND') {
	    console.error('No config file matching NODE_ENV=' + process.env.NODE_ENV 
	      + '. Requires "' + __dirname + '/' + process.env.NODE_ENV + '.js"');
	    process.exit(1);
	  } else {
	    throw err;
	  }
	}*/


var nconf = require('nconf');
var environmentPropertyFile="";
if(process.env.NODE_ENV!=='development' && process.env.NODE_ENV!=='testing' && process.env.NODE_ENV!=='production'){
	environmentPropertyFile="./config/development.json";
}else{
	environmentPropertyFile="./config/"+process.env.NODE_ENV+".json";
}

nconf.argv()
     .env()
     .file({ file:environmentPropertyFile
     });

var port=nconf.get('port');

app.use(qt.static(__dirname + '/'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(logErrors);
app.use(clientErrorHandler);
app.use(errorHandler);
app.use(busboy());

app.use(session({
	  cookieName: 'session',
	  secret: 'random_string_goes_here',
	  duration: 30 * 60 * 1000,
	  activeDuration: 5 * 60 * 1000,
	  httpOnly: true,
	  secure: true,
	  ephemeral: true
	}));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/node_modules', express.static(path.join(__dirname + '/node_modules')));

app.use('/', login);
app.use('/mails', mailUtil);
app.use('/categories', categories);
app.use('/locations', locations);
app.use('/profile', profile);
app.use('/challenge', challenge);
app.use('/subcribeChallenge', subcribeChallenge);
app.use('/solution', solution);
app.use('/contactUs', contactUs);


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
/*app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});*/

function logErrors(err, req, res, next) {
	  console.error(err.stack);
	  next(err);
	}

function clientErrorHandler(err, req, res, next) {
	  if (req.xhr) {
	    res.status(500).send({ error: 'Something failed!' });
	  } else {
	    next(err);
	  }
	}

function errorHandler(err, req, res, next) {
	  res.status(500);
	  res.render('error', { error: err });
	}

app.listen(port,function(){
	console.info("server started...on port:"+port);
});

module.exports = app;
