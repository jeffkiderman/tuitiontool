'use strict'
//@flow

const Kid = require('./Kid.react');
const FamilyInputForm = require('./FamilyInputForm.react');
const React = require('react');
const TuitionScoreCard = require('./TuitionScoreCard.react');
const TuitionSelector = require('./TuitionSelector.react');

var TuitionToolRoot = React.createClass({
  getInitialState: function() {
    return {
      kids: [],
      school: 0,
      kidID: 0,
    };
  },
  componentWillMount: function() {
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
      age: 0,
      name: '',
      gender:'',
      onKidChange: this.handleKidChange,
      onKidRemove: this.handleKidRemove
    };
    // not sure if this creates race condition
    this.setState({kidID: this.state.kidID + 1});
    return newKid;
  },
  render: function() {
    return <div>
      <FamilyInputForm
        kids={this.state.kids}
        onNewKid={this.handleNewKid}
      />
      {/* TODO: for tuition selector & ScoreCard,
        need to integrate with SchoolScripts */}
      <TuitionSelector/>
      <TuitionScoreCard
        kids={this.state.kids}
        school={this.state.school}
      />
    </div>;
  }
});

module.exports = TuitionToolRoot;
