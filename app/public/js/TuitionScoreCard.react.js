'use strict'
//@flow

const Cols = require('./Cols');
const React = require('react');
const SchoolScripts = require('./SchoolScripts');
const TuitionCostTable = require('./TuitionCostTable.react');

import type {KidObject} from './TuitionFlowTypes';
type PropTypes = {
  kids: Array<KidObject>,
  schoolData: Array<string>
}

class TuitionScoreCard extends React.Component {
  props: PropTypes;

  render() {
    if (!this.props.schoolData) {
      return null;
    }
    const schoolObj = SchoolScripts.createSchoolObj(this.props.schoolData);
    const totalTuition = schoolObj.totalTuition(this.props.kids, 0, 20150325);
    const info = schoolObj.basicInfo.printSchoolInfo();
    return <div>
      <div>
      {info.map(function(line, i){
       if(line.id==1) {
         return <a key={i} href={line.value}>{line.value}<br /></a>;
       } else {
       return <span key={line.id}>{line.value}<br /></span>
      };
      })}
        <TuitionCostTable
            bill={totalTuition}
        />
        </div>
    </div>;
  }
}

module.exports = TuitionScoreCard;
