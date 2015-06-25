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

  // Create a couple of LEDs
  var digitalLed = new five.Led({
    pin: 13
  });
  var analogLed = new five.Led({
    pin: 6
  });

  digitalLed.strobe(1000);
  setTimeout(function () {
    analogLed.strobe(1000);
  }, 500);

  this.repl.inject({
    five: five,
    ioBoard: ioBoard,
    digitalLed: digitalLed,
    analogLed: analogLed,
  });
});
