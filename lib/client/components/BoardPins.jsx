/*
 * A simple list of events from the board
 */
'use strict';

var React = require('react');
var Reflux = require('reflux');

var boardUtilities = require('../../utilities');

var boardPinStore = require('../stores/boardPinStore');

var LAST_UPDATED_TIME = 100;

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

    var now = Date.now();

    return (
      <table id="board-pins" className="table table-condensed table-bordered table-hover">
        <thead>
          <tr>
            <th style={{width: '50px'}}>Pin</th>
            <th style={{width: '100px'}}>Mode</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>
          {this.state.boardPins.map(function (pin) {
            var index = pin.index;
            var mode = boardUtilities.getModeNameByValue(pin.mode);
            var value = pin.value;

            // Apply a style for recently updated pins
            var rowClass = '';
            if (now - pin.lastUpdated < LAST_UPDATED_TIME) {
              rowClass = 'warning';
            }

            // For not-so-ugly display, chop/round PWM values
            /*
            if (mode == 'PWM') {
              value = parseFloat(value).toFixed(2);
            }
            */

            return (
              <tr key={ index } className={ rowClass }>
                <td>{ index }</td>
                <td>{ mode }</td>
                <td>{ value }</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    );
  }
});

module.exports = BoardPins;
