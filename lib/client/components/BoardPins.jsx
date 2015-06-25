/*
 * A simple list of events from the board
 */
'use strict';

var React = require('react');
var Reflux = require('reflux');

var boardUtilities = require('../../utilities');

var boardPinStore = require('../stores/boardPinStore');

var BoardPins = React.createClass({
  mixins: [
    Reflux.ListenerMixin
  ],
  getInitialState: function () {
    console.log('BoardPins getInitialState');
    return {
      boardPins: []
    };
  },
  componentDidMount: function () {
    console.log('BoardPins componentDidMount');
    this.listenTo(boardPinStore, this.onBoardPins);
  },
  onBoardPins: function (boardPins) {
    console.log('BoardPins onBoardEvent', arguments);
    this.setState({
      boardPins: boardPins
    });
  },
  render: function () {
    console.log('BoardPins render');
    console.log(this.state);

    return (
      <table className="table table-condensed table-bordered table-hover">
        <thead>
          <tr>
            <th>Pin</th>
            <th>Mode</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>
          {this.state.boardPins.map(function (pin) {
            return (
              <tr key={ pin.index } className={ pin.lastUpdated ? 'warning' : '' }>
                <td>{ pin.index }</td>
                <td>{ boardUtilities.getModeNameByValue(pin.mode) }</td>
                <td>{ pin.value }</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    );
  }
});

module.exports = BoardPins;
