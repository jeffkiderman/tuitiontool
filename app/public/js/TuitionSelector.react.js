'use strict'
// @flow

const React = require('react');
const TuitionScoreCard = require('./TuitionScoreCard.react');
const DropdownButton = require('react-bootstrap').DropdownButton;
const MenuItem = require('react-bootstrap').MenuItem;

import type {SchoolOption} from './TuitionFlowTypes';

type PropTypes = {
  selectedSchool: number,
  schoolData: Array<SchoolOption>,
  onSchoolChange: (newSchoolValue: number) => void
}

// overall, this component is responsible for:
// 1- displaying the select input object to the user
// 2- telling the TuitionToolRoot when the select changes
class TuitionSelector extends React.Component {
  props: PropTypes;

  // for convenience I define this component's own handleSchoolChange funciton,
  // but in practice, it's just callig the onSchoolChange function that was
  // sent down in props.
  handleSchoolChange = (eventKey: string, event: Object) => {
    this.props.onSchoolChange(parseInt(eventKey, 10));
  }

  render () {
      return (<DropdownButton id="school-dropdown" bsStyle="default" title="Choose School" onSelect={this.handleSchoolChange}>
              {this.props.schoolData.map((optionData) => 
                optionData.hasData ? <MenuItem key={optionData.value} eventKey={optionData.value}>{optionData.name}</MenuItem> : null)}
          </DropdownButton>);
  }
}

module.exports = TuitionSelector;
