'use strict'
// @flow

const Kid = require('./Kid.react');
const React = require('react');

var FamilyInputForm = React.createClass({
  render: function() {
    const kidsUI = this.props.kids.map(
      (kidData) => <Kid {...kidData} key={kidData.id}/>
    );
    return <div className="family-section">
      <button
        className="add-kid-button"
        onClick={this.props.onNewKid}>
        Add Child
      </button>
      <div className="kids-section">
        {kidsUI}
      </div>
    </div>;
  }
});

module.exports = FamilyInputForm;
