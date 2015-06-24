/*
 * A simple module to manage all of our socket events etc
 */
'use strict';

var io = require('socket.io-client');

var actions = require('./actions');

var socket = io(location.href);

socket.on('connect', function () {
  console.log('Connected!');
  socket.emit('client-ready');

  socket.on('board-event', function (event) {
    console.log('socket: board-event', event);

    actions.boardEvent(event);
  });
});

module.exports = socket;
