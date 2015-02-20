var util = require('util');
var Emitter = require('events').EventEmitter;

function BrowseIOServer (opts, ioBoard) {
  var express = require('express');
  var app = express();
  var server = require('http').Server(app);
  var io = require('socket.io')(server);
  var self = this;

  opts = opts || {};

  app.use(express.static(__dirname + '/public'));

  app.get('/test', function (req, res) {
    res.end('Browse-IO: Server is running');
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

BrowseIOServer.prototype.close = function () {
  console.log('Browse-IO-Server: closing server');
  this.server.close(function () {
    // Propagate up the event itself
    console.log('Browse-IO-Server: server has closed, emitting full closure');
    this.emit('close');
  }.bind(this));
}

module.exports = BrowseIOServer;
