var five = require('johnny-five');
var BrowseIO = require('./lib/BrowseIO');
var board, led;

var ioBoard = new BrowseIO({
  debug: true
});

board = new five.Board({
  io: ioBoard
});

console.log('Board created');

board.on('ready', function() {
  ioBoard._board = board;
  console.log('Board ready');

  // Create a standard `led` hardware instance
  led = new five.Led({
    pin: 13
  });

  this.repl.inject({
    five: five,
    ioBoard: ioBoard,
    led: led
  });
});
