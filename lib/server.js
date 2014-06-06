var util = require('util');
var Emitter = require('events').EventEmitter;

function BrowseIOServer (opts, ioBoard) {
  var app = require('express')();
  var server = require('http').Server(app);
  var io = require('socket.io')(server);
  var self = this;

  opts = opts || {};

  app.get('/', function (req, res) {
    res.sendfile(__dirname + '/public/index.html');
  });

  io.on('connection', function (socket) {
    console.log('io connection established');

    // TODO Find a better / cleaner way
    // Listen for events on the server to push out
    self.on('event', function (data) {
      socket.emit('event', data);
    });

    // Notify anyone consuming this server that a connection has happened
    self.emit('connection', socket);

    // Some initial data just to see
    debugger;
    socket.emit('board');
    socket.on('ready', function () {
      console.log('client ready');
      self.emit('ready');
    });
  });

  server.listen(opts.port || 3000);

  this.app = app;
  this.server = server;
  this.io = io;

}
util.inherits(BrowseIOServer, Emitter);

module.exports = BrowseIOServer;
