'use strict'
//@flow

const Cols = require('./Cols');
const Kid = require('./Kid.react');
const FamilyInputForm = require('./FamilyInputForm.react');
const React = require('react');
const TuitionScoreCard = require('./TuitionScoreCard.react');
const TuitionSelector = require('./TuitionSelector.react');

var TuitionToolRoot = React.createClass({
  // getInitialState is part of the react lifecycle
  // https://facebook.github.io/react/docs/component-specs.html
  // For components that keep state, this sets the initial state when the
  // component is first created
  getInitialState: function() {
    return {
      kids: [],
      currentSchoolIndex: -1,
      kidID: 0,
      allSchoolData: [],
      schoolOptionData: []
    };
  },
  // componentWillMount is also a react method.  it gets called once in the life
  // of a react component -- and before the render function is called
  componentWillMount: function() {
    // this is your code :)
    // as the TuitionToolRoot is being added to the DOM, we kick off this ajax
    // request.
    var req = new XMLHttpRequest();
    req.open("GET", "http://localhost:3000/sourcedata");
    req.addEventListener(
      "load",
      function() {
        // remember, this function won't get called until this
        // ajax request comes back.
        const allSchoolData = JSON.parse(req.responseText);
        const schoolOptionData = allSchoolData.map(
          (row, index) => ({value: index, name: row[Cols.schoolName]})
        );
        console.log(schoolOptionData);
        // setState takes an object of key-value pairs that you want to set.
        // the ones that you don't set don't update.  In this case, we get the
        // spreadsheet info from the server, and save all of it one time in this
        // component's state.  We'll pass the neccessary pieces of this data
        // down to other components
        this.setState({
          allSchoolData: allSchoolData,
          schoolOptionData: schoolOptionData
        });
        // a general technicality of the 'this' keyword in javascript.  there is
        // a mistake in the language whereby the 'this' keyword does not get bound
        // to it's parent function's 'this'.  so 'componentWillMount's 'this' is
        // the react component.  but if we want to call this.setState inside the
        // function we started in the second arg of 'addEventListener', we need
        // to either say var that = this (<-- you may have seen this code in the book),
        // or just bind the function to 'this' (<-- the 'this' that componentWillMount)
        // has access to.
      }.bind(this)
    );
    req.send();
    // start with one empty kid
    this.setState({
      kids:[this.getNewKid()]
    });
  },
  // this function will be passed to the FamilyInputForm, but it's declared here
  // so that it can operate on the root state.  (remember, we have data flowing)
  // down from TuitionToolRoot to all the other components.
  handleKidChange(id: number, updatedKid: Object) {
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
  },
  handleKidRemove: function(id: number) {
    // very similar to handleKidChange.  no new notes.
    let kidIndex = this.state.kids.findIndex((kid) => kid.id === id);
    // so as to not affect state yet
    let newKids = this.state.kids.slice();
    newKids.splice(kidIndex, 1);
    this.setState({
      kids: newKids
    });
  },
  handleNewKid: function() {
    // Array.concat creates a new array, so we're not manually editing state.
    // rather we pass a new array to setState (like we're sposed to).
    // getNewKid is defined below
    this.setState({
      kids: this.state.kids.concat(this.getNewKid())
    });
  },
  getNewKid:  function() {
    // a kid is just an object :)
    // every kid object has a reference to the update/remove functions which
    // will ultimately be passed as props in the FamilyInputForm
    const newKid = {
      id: this.state.kidID,
      grade: 0,
      name: '',
      gender:'',
      onKidChange: this.handleKidChange,
      onKidRemove: this.handleKidRemove
    };

    // this is our kidID counter.  I didn't rely on the index of each kid bc
    // kids can get deleted and it would just get messy.
    this.setState({kidID: this.state.kidID + 1});
    return newKid;
  },
  // not dissimilar from updating our kid information, this function (which gets)
  // passed to the TuitionSelector updates our currently selected school
  onSchoolChange: function(newSchoolValue: number) {
    // sidenote: i'm pretty sure you can't add new state.  all state was
    // initiallydefined in getInitialState and these setState calls just update
    // that initial state.
    this.setState({currentSchoolIndex: newSchoolValue});
  },
  // at last, the moneymaker.  the render function :)
  render: function() {
    // this local const is just for convenience.  I use const when I don't expect
    // a value to change, and 'let' when I do.  it's a recommended convention.
    const index = this.state.currentSchoolIndex;
    // same thing here - just a convenience. fetch current school's row of data.
    const currentSchool = this.state.allSchoolData[index];
    // render returns one element, so I'm wrapping everyone in a div
    return <div>
      {
        // now we are in JSX-land. So if I want to write a javascript comment
        // I have to use {} to escape-myself back to javascript.
        // the close brace is on the next line bc look:  }  <-- part of comment
        // I could also use /* */ comment notation as I will below.
      }

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
});

module.exports = TuitionToolRoot;
