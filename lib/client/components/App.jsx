/*
 * Our top-level Application view component
 */
'use strict';

// Baseline dependencies
// Styles
require('bootstrap/dist/css/bootstrap.css');
require('../styles/app.css');

// React bits
var React = require('react');
var Reflux = require('reflux');

// Other components
var NavBar = require('./NavBar.jsx');
var BoardPins = require('./BoardPins.jsx');
var BoardEventList = require('./BoardEventList.jsx');

// Other things
var boardEventStore = require('../stores/boardEventStore');

// Make our app!
var App = React.createClass({
  mixins: [
    Reflux.ListenerMixin
  ],
  getInitialState: function () {
    console.log('app getInitialState');
    return {
      lastEvent: 'None yet'
    };
  },
  componentDidMount: function () {
    console.log('app componentDidMount');
    this.listenTo(boardEventStore, this.onBoardEvent);
  },
  onBoardEvent: function (boardEvents) {
    console.log('app onBoardEvent', arguments);
    this.setState({
      lastEvent: boardEvents[0].timestamp.toLocaleString()
    });
  },
  render: function () {
    console.log('app render');
    return (
      <div>
        <NavBar title={ this.props.title } />
        <div className="container">
          <h1>{this.props.title}</h1>
          <p>Last Event: { this.state.lastEvent }</p>
          <hr />
          <div className="row">
            <div className="col-md-8">
              <h2>Pin Inspection</h2>
              <BoardPins />
            </div>
            <div className="col-md-4">
              <h2>Recent Events</h2>
              <BoardEventList />
            </div>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = App;
