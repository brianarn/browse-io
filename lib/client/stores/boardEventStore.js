var Reflux = require('reflux');
var actions = require('../actions');

var nextEventId = 0;
var maxEvents = 10;

var boardEventStore = Reflux.createStore({
  init: function () {
    this.boardEvents = [];
    this.listenToMany(actions);
  },
  onBoardEvent: function (event) {
    // Set an event
    // (which I realize I could one-line, but I prefer
    // the clarity of two
    event.id = nextEventId;
    nextEventId++;

    // Timestamp it
    event.timestamp = new Date();

    // Push it on in
    this.boardEvents.unshift(event);

    // Trim down per max events
    if (this.boardEvents.length > maxEvents) {
      this.boardEvents = this.boardEvents.slice(0,maxEvents);
    }

    // Send out an update
    this.trigger(this.boardEvents);
  }
});

module.exports = boardEventStore;
