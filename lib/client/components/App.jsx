/*
 * Our top-level Application view component
 */
'use strict';

// Baseline dependencies
var bootstrap = require('bootstrap/dist/css/bootstrap.css');
var React = require('react');
var Reflux = require('reflux');

var BoardEventList = require('./BoardEventList.jsx');
var boardEventStore = require('../stores/boardEventStore');

var App = React.createClass({
  mixins: [
    Reflux.ListenerMixin
  ],
  getInitialState: function () {
    console.log('app getInitialState');
    return {
      title: 'Browser IO',
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
      lastEvent: boardEvents[0].timestamp.toString()
    });
  },
  render: function () {
    console.log('app render');
    return (
      <div className="container">
        <h1>{this.state.title}</h1>
        <p>Last Event: { this.state.lastEvent }</p>
        <h2>Recent Events</h2>
        <BoardEventList />
      </div>
    );
  }
});

module.exports = App;
