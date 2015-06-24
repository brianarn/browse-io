'use strict';

var React = require('react');
var App = require('./components/App.jsx');

// Loading our socket module has a side effect:
// Actually starts up all the listening to the server.
// No actual need to use a thing.
var socket = require('./socket');

React.render(
  <App title="Browse IO" />,
  document.getElementById('app')
);
