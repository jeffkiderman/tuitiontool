//Kid.js
//@flow

const React = require('React');

var Kid = React.createClass({
  handleChange: function(event: Object, key: string) {
    const value = event.target.value;
    let newProps = Object.assign({}, this.props);
    newProps[key] = value;
    this.props.onKidChange(
      this.props.id,
      {...newProps}
    );
  },
  render: function() {
    return (
      <div className="kid-root">
        <div
          className="kid-xout"
          onClick={() => this.props.onKidRemove(this.props.id)}>
          &times;
        </div>
        <div>
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
