'use strict'
//@flow

const Cols = require('./Cols');
const Kid = require('./Kid.react');
const FamilyInputForm = require('./FamilyInputForm.react');
const React = require('react');
const TuitionScoreCard = require('./TuitionScoreCard.react');
const TuitionSelector = require('./TuitionSelector.react');
const TuitionCostTable = require('./TuitionCostTable.react');

import type {KidObject} from './TuitionFlowTypes';
import type {SchoolOption} from './TuitionFlowTypes';

type StateTypes = {
  kids: Array<KidObject>,
  currentSchoolIndex: number,
  kidID: number,
  allSchoolData: Array<Array<string>>, // of excel rows
  schoolOptionData: Array<SchoolOption>
};

class TuitionToolRoot extends React.Component {
  props: {};

  state: StateTypes;

  // getInitialState is part of the react lifecycle
  // https://facebook.github.io/react/docs/component-specs.html
  // For components that keep state, this sets the initial state when the
  // component is first created
  constructor(props: Object) {
    super(props);
    this.state = {
      kids: [this.getNewKid(0)],
      currentSchoolIndex: -1,
      kidID: 1,
      allSchoolData: [],
      schoolOptionData: []
    };

    // this is your code :)
    // as the TuitionToolRoot is being added to the DOM, we kick off this ajax
    // request.
    var req = new XMLHttpRequest();
    req.open("GET", "http://localhost:3000/sourcedata");
    req.addEventListener(
      "load",
      () => {
        // remember, this function won't get called until this
        // ajax request comes back.
        //allSchoolData is an array representing the data from the spreadsheet
        const allSchoolData = JSON.parse(req.responseText);
        //schoolOptionData is an array of objects representing schoolName-index(row)
        // pairs of schools in allSchoolData
        const schoolOptionData = allSchoolData.map(
          (row, index) => ({
            value: index,
            name: row[Cols.schoolName],
            // proxy for whether we have data for this school
            hasData: row[Cols.tuitYear] !== undefined
          })
        );

        // setState takes an object of key-value pairs that you want to set.
        // the ones that you don't set don't update.  In this case, we get the
        // spreadsheet info from the server, and save all of it one time in this
        // component's state.  We'll pass the neccessary pieces of this data
        // down to other components
        this.setState({
          allSchoolData: allSchoolData,
          schoolOptionData: schoolOptionData
        });
      }
    );
    req.send();
  }
  // this function will be passed to the FamilyInputForm, but it's declared here
  // so that it can operate on the root state.  (remember, we have data flowing)
  // down from TuitionToolRoot to all the other components.
  handleKidChange = (id: number, updatedKid: Object): void => {
    // find the index of the kid whose id matches the id argument.
    // note that findIndex takes a function which we've declared inline
    let kidIndex = this.state.kids.findIndex((kid) => kid.id === id);
    // slice makes a copy of the array.  you're not supposed to operate on state
    // directly.  you're supposed to call setState.  so we make a copy of it,
    // edit it, and then call setState
    let newKids = this.state.kids.slice();
    // replace old kid Object with new one passed by the caller of this function
    newKids[kidIndex] = updatedKid;
    // set state :).  This is the goal of the handleKidChange function.
    // like we said-- we handle updating the data, react will handle
    // the rendering from there
    this.setState({
      kids: newKids
    });
  }

  handleKidRemove = (id: number): void => {
    // very similar to handleKidChange.  no new notes.
    let kidIndex = this.state.kids.findIndex((kid) => kid.id === id);
    // so as to not affect state yet
    let newKids = this.state.kids.slice();
    newKids.splice(kidIndex, 1);
    this.setState({
      kids: newKids
    });
  }

  handleNewKid = (): void => {
    // Array.concat creates a new array, so we're not manually editing state.
    // rather we pass a new array to setState (like we're sposed to).
    // getNewKid is defined below
    this.setState({
      kids: this.state.kids.concat(this.getNewKid())
    });
  }

  getNewKid = (idOverride: ?number): KidObject => {
    // a kid is just an object :)
    // every kid object has a reference to the update/remove functions which
    // will ultimately be passed as props in the FamilyInputForm
    const newID = idOverride !== null && idOverride !== undefined
      ? idOverride
      : this.state.kidID;

    const newKid = {
      id: newID,
      grade: 0,
      name: '',
      gender: '',
      onKidChange: this.handleKidChange,
      onKidRemove: this.handleKidRemove
    };

    // if there was no override, update ID counter
    if (idOverride === null || idOverride === undefined) {
      this.setState({kidID: this.state.kidID + 1});
    }
    return newKid;
  }
  // not dissimilar from updating our kid information, this function (which gets)
  // passed to the TuitionSelector updates our currently selected school
  onSchoolChange = (newSchoolValue: number): void  => {
    // sidenote: i'm pretty sure you can't add new state.  all state was
    // initiallydefined in getInitialState and these setState calls just update
    // that initial state.
    this.setState({currentSchoolIndex: newSchoolValue});
  }

  // at last, the moneymaker.  the render function :)
  render() {
    // this local const is just for convenience.  I use const when I don't expect
    // a value to change, and 'let' when I do.  it's a recommended convention.
    const index = this.state.currentSchoolIndex;
    // same thing here - just a convenience. fetch current school's row of data.
    const currentSchool = this.state.allSchoolData[index];
    // render returns one element, so I'm wrapping everyone in a div
    return <div>
      {/* this.state.kids is an array of all the kids objects
        it and the handleNewKid function are being passed as props
        to FamilyInputForm.  Spoiler: FamilyInputForm is going to pass each
        kid object in the array as props to a Kid react element :)

        I'll spare you more comments on the TuitionSelector and ScoreCard.  :)
      */}
      <FamilyInputForm
        kids={this.state.kids}
        onNewKid={this.handleNewKid}
      />
      <TuitionSelector
        selectedSchool={index}
        schoolData={this.state.schoolOptionData}
        onSchoolChange={this.onSchoolChange}/>
      <TuitionScoreCard
        kids={this.state.kids}
        schoolData={currentSchool}
      />
    </div>;
  }
}

module.exports = TuitionToolRoot;
