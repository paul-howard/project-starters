var express    = require('express');
var morgan     = require('morgan');
var compress   = require('compression');
var bodyParser = require('body-parser');

module.exports = function() {
  var app = express();

  // Define NODE_ENV-dependant middlewares
  if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
  } else if (process.env.NODE_ENV === 'production') {
    app.use(compress());
  }

  // Define non-dependant middlewares
  app.use(bodyParser.urlencoded({
    extended: true
  }));
  app.use(bodyParser.json());

  app.set('views', './app/views');
  app.set('view engine', 'ejs');

  // Require all routes files
  require('../app/routes/index.server.routes.js')(app);

  // Return configured app
  return app;
};
