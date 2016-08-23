//Kid.js
//@flow

const React = require('React');

var Kid = React.createClass({
  handleChange: function(event: Object, key: string) {
    const value = event.target.value;
    // make a copy of props (which is a js object of key-value pairs)
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign
    let newKidObj = Object.assign({}, this.props);
    // make the change to the kid object, then call TuitionToolRoot's fn with
    // the replacement object

    // in this case, I decided to make handleChange general, so it could handle
    // changes to gender, grade, name, etc.  check out the handler functions
    // below that set the 'key' that is to be updated
    newKidObj[key] = value;
    this.props.onKidChange(
      this.props.id,
      newKidObj,
    );
  },
  render: function() {
    return (
      <div className="kid-root">
        {/* this is where it starts to get real sexy.  click on the X, and
          it will call the onKidRemove props (which came from the kid object
          which got passed from TuitionToolRoot).  the onKidRemove in
          TuitionToolRoot will find the id in its array of kid objects, then
          remove that index, and setState.

          since setState was calld, TuitionToolRoot re-renders and sends new
          props down to FamilyInputForm that doesn't include the X'd kid.

          FamilyInputForm re-renders all the kids sent to it in props, which--
          no longer includes the X'd kid!  So the X'd kid disappears from the
          UI.  And all we had to do was remove it from the top-level data
          structure.  The rest happened for free :)
       */}
        <div
          className="kid-xout"
          onClick={() => this.props.onKidRemove(this.props.id)}>
          &times;
        </div>
        <div>
        {/* The name input feels a little heavy handed since it goes through
          the very same flow as the remove kid.  calls a fn in TuitionToolRoot,
          updats the kid object, which re-renders all the way down to this
          component which will then reflect the new name value using the
          defaultValue={this.props.name} line below.
           */}
          Name (optional):
          <input
            className="kid-name"
            onChange={(event) => this.handleChange(event, 'name')}
            type="text"
            defaultValue={this.props.name}/>
        </div>
        <div>
          Grade:
          <input
            className="kid-grade"
            onChange={(event) => this.handleChange(event, 'grade')}
            type="number"
            defaultValue={this.props.grade}/>
        </div>
        <div>
          Gender:
          <label>
            <input
              className="kid-gender"
              onClick={(event) => this.handleChange(event, 'gender')}
              type="radio"
              value="Male"
              checked={this.props.gender === 'Male'}/>
            Male
          </label>
          <label>
            <input
              className="kid-gender"
              onClick={(event) => this.handleChange(event, 'gender')}
              type="radio"
              value="Female"
              checked={this.props.gender === 'Female'}/>
            Female
          </label>
        </div>
      </div>
    );
  }
});

module.exports = Kid;
