'use strict'
//@flow

const Cols = require('./Cols');
const Kid = require('./Kid.react');
const FamilyInputForm = require('./FamilyInputForm.react');
const React = require('react');
const TuitionScoreCard = require('./TuitionScoreCard.react');
const TuitionSelector = require('./TuitionSelector.react');

var TuitionToolRoot = React.createClass({
  getInitialState: function() {
    return {
      kids: [],
      currentSchoolIndex: -1,
      kidID: 0,
      allSchoolData: [],
      schoolOptionData: []
    };
  },
  componentWillMount: function() {
    var req = new XMLHttpRequest();
    req.open("GET", "http://localhost:3000/sourcedata");
    req.addEventListener(
      "load",
      function() {
        const allSchoolData = JSON.parse(req.responseText);
        const schoolOptionData = allSchoolData.map(
          (row, index) => ({value: index, name: row[Cols.schoolName]})
        );
        this.setState({
          allSchoolData: allSchoolData,
          schoolOptionData: schoolOptionData
        });
      }.bind(this)
    );
    req.send();
    // start with one empty kid
    this.setState({
      kids:[this.getNewKid()]
    });
  },
  handleKidChange(id: number, updatedKid: Object) {
    let kidIndex = this.state.kids.findIndex((kid) => kid.id === id);
    // so as to not affect state yet
    let newKids = this.state.kids.slice();
    newKids[kidIndex] = updatedKid;
    this.setState({
      kids: newKids
    });
  },
  handleKidRemove: function(id: number) {
    let kidIndex = this.state.kids.findIndex((kid) => kid.id === id);
    // so as to not affect state yet
    let newKids = this.state.kids.slice();
    newKids.splice(kidIndex, 1);
    this.setState({
      kids: newKids
    });
  },
  handleNewKid: function() {
    this.setState({
      kids: this.state.kids.concat(this.getNewKid())
    });
  },
  getNewKid:  function() {
    const newKid = {
      id: this.state.kidID,
      grade: 0,
      name: '',
      gender:'',
      onKidChange: this.handleKidChange,
      onKidRemove: this.handleKidRemove
    };
    // not sure if this creates race condition
    this.setState({kidID: this.state.kidID + 1});
    return newKid;
  },
  onSchoolChange: function(newSchoolValue: number) {
    this.setState({currentSchoolIndex: newSchoolValue});
  },
  render: function() {
    const index = this.state.currentSchoolIndex;
    const currentSchool = this.state.allSchoolData[index];
    return <div>
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
});

module.exports = TuitionToolRoot;
