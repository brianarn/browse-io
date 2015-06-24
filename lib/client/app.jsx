/*
 * Our top-level Application view component
 */
'use strict';

// Baseline dependencies
var bootstrap = require('bootstrap/dist/css/bootstrap.css');
var React = require('react');
var Reflux = require('reflux');
var boardStore = require('./boardStore');

var App = React.createClass({
  mixins: [
    Reflux.ListenerMixin
  ],
  getInitialState: function () {
    console.log('app getInitialState');
    return {
      title: 'Browser IO',
      lastEvent: 'None yet',
      boardEvents: []
    };
  },
  componentDidMount: function () {
    console.log('app componentDidMount');
    this.listenTo(boardStore, this.onBoardEvent);
  },
  onBoardEvent: function (boardEvents) {
    console.log('app onBoardEvent', arguments);
    this.setState({
      lastEvent: boardEvents[0].timestamp.toString(),
      boardEvents: boardEvents
    });
  },
  render: function () {
    console.log('app render');
    return (
      <div className="container">
        <h1>{this.state.title}</h1>
        <p>Last Event: { this.state.lastEvent }</p>
        <h2>Recent Events</h2>
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
      </div>
    );
  }
});

module.exports = App;
