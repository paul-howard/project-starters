var express    = require('express');
var morgan     = require('morgan');
var compress   = require('compression');
var bodyParser = require('body-parser');
var favicon    = require('serve-favicon');

module.exports = function() {
  var app = express();

  // Define NODE_ENV-dependant middlewares
  if (process.env.NODE_ENV === 'development') {

    app.use(morgan('dev'));

  } else if (process.env.NODE_ENV === 'production') {

    app.use(compress());

  }

  // Define non-dependant middlewares
  app.use(favicon('./public/favicon.ico'));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({
    extended: true
  }));

  // Configure view engine
  app.set('view engine', 'ejs');
  app.set('views', './app/views');

  // Require all routes files
  require('../app/routes/index.server.routes.js')(app);

  app.use(express.static('./public'));
  app.use(express.static('./node_modules'));

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

  // Return configured app
  return app;
};
