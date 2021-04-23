var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const PORT = 5000;
const socket = require("socket.io");

//
var http = require('http');
//var server = http.createServer(app);
//var io = require('socket.io');
//var { Server } = require("socket.io");
//var io = new Server(server);


var flash = require('express-flash');
var session = require('express-session');
var mysql = require('mysql');
var connection  = require('./lib/db');


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();
const server = app.listen(PORT, function () {
  console.log(`Listening on port ${PORT}`);
  console.log(`http://localhost:${PORT}`);
});
const io = socket(server);
var playlistRouter = require('./routes/play_list')(io);

//var routes = require('./routes')(io);

//
//
/*
Create socket io to real time updation
// */
// var server = require('http').Server(app);
// var io = require('socket.io')(server);
/*
*/

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({ 
  cookie: { maxAge: 60000 },
  store: new session.MemoryStore,
  saveUninitialized: true,
  resave: 'true',
  secret: 'secret'
}))
app.use(flash());

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/playlist', playlistRouter);


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
// server.listen(4000, () => {
//   //console.log('listening on *:4000');
// });
io.on('connection', (socket) => {
  console.log('a user connected');

});



//

// var server = http.createServer(app);
//  io.listen(server);

// io.sockets.on('connection', function (socket) {
//   socket.on('messageChange', function (data) {
//     console.log(data);
//     socket.emit('receive', data.message.split('').reverse().join('') );
//   });
// });

// server.listen(app.get('port'), function(){
//   console.log('Express server listening on port ' + app.get('port'));
// });

// io.sockets.on('connection', function (socket) {
//   socket.on('messageChange', function (data) {
//     console.log(data);
//     socket.emit('receive', data.message.split('').reverse().join('') );
//   });
// });

// server.listen(app.get('port'), function(){
//   console.log('Express server listening on port ' + app.get('port'));
// });



//

module.exports = app;
