/*
 * A header for the page, which is arguably just a template with no updates
 */
'use strict';

var React = require('react');

var NavBar = React.createClass({
  render: function () {
    return (
      <nav className="navbar navbar-default navbar-static-top">
        <div className="container">

          <div className="navbar-header">
            <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar-collapse-1">
              <span className="sr-only">Toggle navigation</span>
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
            </button>
            <a className="navbar-brand" href="/">{ this.props.title }</a>
          </div>

          <div className="collapse navbar-collapse" id="navbar-collapse-1">
            <ul className="nav navbar-nav">
            </ul>
          </div>
        </div>
      </nav>
    );
  }
});

module.exports = NavBar;
