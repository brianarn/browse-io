var five = require('johnny-five');
var BrowseIO = require('../lib/BrowseIO');
var board, led;

var colors = [
  '#FF0000', // Red
  '#FFA500', // Orange
  '#FFFF00', // Yellow
  '#008000', // Green
  '#0000FF', // Blue
  '#4B0082', // Indigo
  '#EE82EE'  // Violet
];
var colorIndex = 0;

var ioBoard = new BrowseIO({
  debug: true
});

five.Board({
  io: ioBoard
}).on("ready", function() {

  // Initialize the RGB LED
  var led = new five.Led.RGB({
    pins: {
      red: 6,
      green: 5,
      blue: 3
    }
  });

  // Add led to REPL
  this.repl.inject({
    led: led
  });

  // Turn it on and start color rotation
  led.on();
  setInterval(function () {
    var newColor = colors[colorIndex];
    console.log('Setting color to',newColor);
    led.color(newColor);
    colorIndex = (colorIndex + 1) % colors.length;
  }, 500);
});
