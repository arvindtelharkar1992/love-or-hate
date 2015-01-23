var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();
var twitter = require('ntwitter');
var server = require('http').createServer(app);
var port = 3000;
server.listen(port);

var sio = require('socket.io').listen(server);

var count_love = 0;
var count_hate = 0;
var count_total = 0;

var t = new twitter({
  consumer_key: '####',
  consumer_secret: '######',
  access_token_key: '#####',
  access_token_secret: '####'
});

sio.sockets.on('connection',function(socket){
console.log('Connected To Client');
t.stream('statuses/filter', { track: ['love', 'hate'] }, function(stream) {
  stream.on('data', function (current_tweet) {

var content = current_tweet.text.toLowerCase();
  if (content.indexOf('love') !== -1)
    {
      count_love=count_love+1;
      count_total=count_total+1;
    }
    if (content.indexOf('hate') !== -1)
    {
      count_hate=count_hate+1;
      count_total=count_total+1; 
    }

   socket.volatile.emit('analysis_done',{
   user: current_tweet.user.screen_name,
   text: current_tweet.text,
   love_count: count_love,
   hate_count: count_hate,
   total_count: count_total,
   love_percentage: (count_love/count_total)*100,
   hate_percentage: (count_hate/count_total)*100
    });

  
  });
});


});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);

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


module.exports = app;
