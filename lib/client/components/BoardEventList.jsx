/*
 * A simple list of events from the board
 */
'use strict';

var React = require('react');
var Reflux = require('reflux');

var boardEventStore = require('../stores/boardEventStore');

var BoardEventList = React.createClass({
  mixins: [
    Reflux.ListenerMixin
  ],
  getInitialState: function () {
    console.log('BoardEventList getInitialState');
    return {
      boardEvents: []
    };
  },
  componentDidMount: function () {
    console.log('BoardEventList componentDidMount');
    this.listenTo(boardEventStore, this.onBoardEvent);
  },
  onBoardEvent: function (boardEvents) {
    console.log('BoardEventList onBoardEvent', arguments);
    this.setState({
      boardEvents: boardEvents
    });
  },
  render: function () {
    console.log('BoardEventList render');
    console.log(this.state);
    return (
      <table className="table table-condensed">
        <thead>
          <tr>
            <th>Type</th>
            <th>Arguments</th>
            <th>Timestamp</th>
          </tr>
          {this.state.boardEvents.map(function (event) {
            return (
              <tr>
                <td>{ event.type }</td>
                <td><code>{ JSON.stringify(event.args) }</code></td>
                <td>{ event.timestamp.toString() }</td>
              </tr>
            )
          })}
        </thead>
      </table>
    );
  }
});

module.exports = BoardEventList;