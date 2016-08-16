// TuitionSelector.react
'use strict'
//@flow

const React = require('react');
const TuitionScoreCard = require('./TuitionScoreCard.react');

var TuitionSelector = React.createClass({
  handleSchoolChange: function(event) {
    this.props.onSchoolChange(event.target.value);
  },
  render: function() {
    return (
      <select
        value={this.props.selectedSchool}
        onChange={this.handleSchoolChange}>
        <option value="-1" key="-1">Choose School...</option>
        {this.props.schoolData.map(
          (optionData) =>
            <option value={optionData.value} key={optionData.value}>
              {optionData.name}
            </option>
        )}
      </select>
    );
  }
});

module.exports = TuitionSelector;
