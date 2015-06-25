var Reflux = require('reflux');
var actions = require('../actions');

var nextEventId = 0;
var maxEvents = 10;

var lastUpdatedPin;

var boardPinStore = Reflux.createStore({
  init: function () {
    this.boardPins = [];
    this.listenTo(actions.boardDetails, this.onBoardDetails);
    this.listenTo(actions.boardEvent, this.onPinUpdate);
  },
  onBoardDetails: function (event) {
    var eventPins = event.pins;
    var pins = [];
    var pin;
    var pinIndex = 0;

    for (var pinKey in eventPins) {
      pin = event.pins[pinKey];
      pin.index = pinIndex;
      pinIndex++;
      pins.push(pin);
    }

    this.boardPins = pins;

    // Send out an update
    this.trigger(this.boardPins);
  },
  onPinUpdate: function (event) {
    var type = event.type;
    var args = event.args;
    var pinIndex = args[0];
    var pin = this.boardPins[pinIndex];

    // If we somehow don't have a pin, get out
    if (!pin) {
      console.warn('Invalid pin to update');
    }

    // Assume we'll be updating the pin
    var didUpdate = true;

    // Take an action based on the event type
    switch (type) {
      case 'pinMode':
        pin.mode = args[1];
        break;
      //Intentional fallthrough on the writes
      case 'digitalWrite':
      case 'analogWrite':
        pin.value = args[1];
        break;
      default:
        // We didn't act, so warn and ensure we don't change
        console.warn('BoardPinStore: Board event type ' + type + ' not yet implemented');
        didUpdate = false;
    }

    // If we updated, clear out the most
    // recently updated pin and make note of this one
    if (didUpdate) {
      if (lastUpdatedPin) {
        lastUpdatedPin.lastUpdated = false;
      }
      pin.lastUpdated = true;
      lastUpdatedPin = pin;
    }

    this.trigger(this.boardPins);
  }
});

module.exports = boardPinStore;
