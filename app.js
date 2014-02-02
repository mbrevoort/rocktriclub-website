
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var http = require('http');
var path = require('path');
var config = require('./lib/config')

var app = express();

// all environments
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.compress());
app.use(express.cookieParser());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.locals.env = app.get('env');

app.get('/', routes.index);
app.get('/member', routes.member);
app.get('/results', routes.results);
app.get('/workouts', routes.workouts);
app.post('/api/join', routes.stripe.join);

console.log('config', config);

http.createServer(app).listen(config.port, function(){
  console.log('Express server listening on port ' + config.port);
});


