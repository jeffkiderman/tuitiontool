'use strict'
//@flow

const React = require('react');

class LeftRight extends React.Component {
  render() {
    return <div className="lr">
      <span className="lr-left">{this.props.left}</span>
      <span className="lr-right">{this.props.right}</span>
    </div>;
  }
}

module.exports = LeftRight;
