var Hapi = require('hapi');
var events = require('../events');

function BrowseIOServer (opts) {
  // Set up some reasonable defaults
  opts = opts || {};
  opts.port = opts.port || 3000;

  // Create a server instance, which we'll be returning
  var server = new Hapi.Server();
  server.connection(opts);

  // Routing!
  // Simple test
  server.route({
    method: 'GET',
    path: '/test',
    handler: function (request, reply) {
      reply('BrowseIO: Server is running on port ' + opts.port);
    }
  });

  // Static files route
  server.route({
    method: 'GET',
    path: '/{static*}',
    handler: {
      directory: {
        path: 'public'
      }
    }
  });

  // Wire socket.io into the server
  var io = require('socket.io')(server.listener);

  // Handle socket.io connections
  io.on('connection', function (socket) {
    console.log('Server: Socket connected');

    // Let the world know we're here
    events.emit('socket-connection', socket);

    // When we get a board-related event, pass it through
    console.log('Server: Establishing event listeners');
    [
      'board-event',
      'board-details'
    ].forEach(function (boardEvent) {
      events.on(boardEvent, function(event) {
        console.log('Server: Event:', boardEvent);
        socket.emit(boardEvent, event);
      });
    });

    // Socket events
    socket.on('client-ready', function () {
      console.log('Server: Client ready');
      events.emit('server-ready');
    });
  });

  // Actually spin up the server now
  server.start(function () {
    console.log('Server: Server started');
  });

  return server;
}

/*
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
};
*/

module.exports = BrowseIOServer;
