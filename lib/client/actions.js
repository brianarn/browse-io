'use strict';

var Reflux = require('reflux');

var actions = {
  boardEvent: Reflux.createAction()
};

actions.boardEvent.listen(function () {
  console.log('Board Event Action:', arguments);
});

module.exports = actions;
