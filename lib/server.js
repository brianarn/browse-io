var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);

app.get('/', function (req, res) {
  res.sendfile(__dirname + '/public/index.html');
});

io.on('connection', function (socket) {
  console.log('io connection');
  socket.emit('syn', Date.now());
  socket.on('ack', function (data) {
    console.log('ack: ', data);
  });
});

server.listen(3000);
console.log('Up and listening');
