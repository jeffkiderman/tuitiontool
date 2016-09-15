'use strict'
// @flow

const React = require('react');
const TuitionScoreCard = require('./TuitionScoreCard.react');

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
  handleSchoolChange = (event: Object) => {
    this.props.onSchoolChange(parseInt(event.target.value, 10));
  }

  render() {
    return (
      // select tag documentation is here:
      // https://facebook.github.io/react/docs/forms.html
      // in general, I have only stated to find these docs helpful once I knew
      // what the heck I was talking about.  not great learning docs.
      <select
        // the 'value' of the select is the currently selected school.  Whichever
        // option (defined below) matches this value is the selected one.
        //
        // It would be reasonable for this component to store this value in its
        // own state.  however, since TuitionToolRoot cares which the selected
        // school is (since it has to render the Score Card), and since data only
        // flows down, not up, storing it in state here would be a dead end.
        // Instead, we call a funciton that updates TuitionToolRoot's state,
        // and get that same value propogated down to this component as a fresh
        // set of props.
        value={this.props.selectedSchool}
        // Important to point out that this is where the selection change
        // gets triggered. this react compoenent's onChange is a proxy for the
        // onchange event which calls the function with an standard event object.
        // handleSchoolChange above traverses this object and passes calls
        // the props funtion with the important data.

        onChange={this.handleSchoolChange}>
        {/* Now we list all of the select options, starting with a default,
          then the rest of the school names.
          note: check out TuitionToolRoot's currentSchoolIndex in getInitialState.
          It matches our 'Choose School...' value, making it the default when
          the page first loads :)
         */}
        <option value="-1" key="-1">Choose School...</option>
        {/*This next part is cool.  we use the Arrays.map function to create
          one <option> </option> tag/component for each value passed in
          props.schoolData (which is an array of name and value keys.
          see the componentWillMount function in TuitionToolRoot where this
          data is constructed.

          The map function returns an array.  React just renders each of the
          compoenents.  it doesnt' care that they're in an array.
        )*/}
        {this.props.schoolData.map(
          (optionData) => optionData.hasData
            ? <option value={optionData.value} key={optionData.value}>
              {optionData.name}
              </option>
            : null
        )}
      </select>
    );
  }
}

module.exports = TuitionSelector;
