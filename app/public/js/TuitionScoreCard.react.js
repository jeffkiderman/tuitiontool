'use strict'
//@flow

const Cols = require('./Cols');
const React = require('react');
const SchoolScripts = require('./SchoolScripts');

var TuitionScoreCard = React.createClass({
  render: function() {
    if (!this.props.schoolData) {
      return null;
    }
    const schoolObj = SchoolScripts.createSchoolObj(this.props.schoolData);
    const totalTuition = schoolObj.totalTuition(this.props.kids, 0, 20150325);
    return <div>
      <div>School Name: {this.props.schoolData[Cols.schoolName]}</div>
      <div>Tuition Details {'TODO: haz no details...yet!'}</div>
      <div>Cost: {totalTuition}</div>
    </div>;
  }
});

module.exports = TuitionScoreCard;
