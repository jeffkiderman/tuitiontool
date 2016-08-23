'use strict'
// @flow

const Kid = require('./Kid.react');
const React = require('react');

// We're getting a nice separation of concerns here.  Now we're in family-land
// and we care about two things:
// 1- displaying the fam
// 2- sending updates up to TuitionToolRoot.  As I've noted elsewhere, data
// should only flow one way, so when I say 'send updates up', i just mean calling
// the function that was passed into this component -- which conveniently affect
// state in the TuitionToolRoot.  Were we only to modify state in this component,
// TuitionToolRoot would not be able to read it or react to it.
var FamilyInputForm = React.createClass({
  // jumping right into the render funtion!
  render: function() {
    // this.props.kid is an array of kid objects <-- simple js objects.
    // now we take each kid object and pass them as props to a Kid component
    const kidsUI = this.props.kids.map(
      // {...kidData} is fancy JSX syntax that parallels a new javascript syntax for
      // arrays, called 'spread'. see https://facebook.github.io/react/docs/jsx-spread.html#spread-attributes.
      //
      // what it does is take kidData and unwraps it as key-value attributes
      // passed to the Kid.
      // so if kidData was {name: 'jeff', grade: 4}, it would
      // unpack those to be name="jeff" grade="4", which is a convenient way
      // to turn data/objects into props :)
      (kidData) => <Kid {...kidData} key={kidData.id}/>
    );
    return <div className="family-section">
      {/* button is yet another react component that closely mirrors the html
        element of the same name.  onClick translates to the
        html button onclick handler, etc */}
      <button
        className="add-kid-button"
        onClick={this.props.onNewKid}>
        Add Child
      </button>
      <div className="kids-section">
      {/* all of the Kid react elements */}
        {kidsUI}
      </div>
    </div>;
  }
});

module.exports = FamilyInputForm;
