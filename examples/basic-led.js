var five = require('johnny-five');
var BrowseIO = require('../lib/BrowseIO');
var board, led;

var ioBoard = new BrowseIO({
  debug: true,
  forward: true
});

board = new five.Board({
  io: ioBoard
});

console.log('Board created');

board.on('ready', function() {
  console.log('Board ready');

  var led = new five.Led({
    pin: 13
  });

  this.repl.inject({
    five: five,
    ioBoard: ioBoard,
    //board: board,
    led: led
  });
});
