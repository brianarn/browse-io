var util = require('util');
var Emitter = require('events').EventEmitter;

function BrowseIOServer (opts) {
  var app = require('express')();
  var server = require('http').Server(app);
  var io = require('socket.io')(server);
  var self = this;

  opts = opts || {};

  app.get('/', function (req, res) {
    res.sendfile(__dirname + '/public/index.html');
  });

  io.on('connection', function (socket) {
    self.emit('connection');
    console.log('io connection');
    socket.emit('syn', Date.now());
    socket.on('ack', function (data) {
      console.log('ack: ', data);
    });
  });

  server.listen(opts.port || 3000);

  this.app = app;
  this.server = server;
  this.io = io;
}
util.inherits(BrowseIOServer, Emitter);

module.exports = BrowseIOServer;
