var Reflux = require('reflux');
var actions = require('../actions');

var nextEventId = 0;

var boardStore = Reflux.createStore({
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

    // Trim down to the last 50
    if (this.boardEvents.length > 50) {
      this.boardEvents = this.boardEvents.slice(0,49);
    }

    // Send out an update
    this.trigger(this.boardEvents);
  }
});

module.exports = boardStore;
