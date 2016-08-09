'use strict';
// @flow

const React = require('react');
const ReactDOM = require('react-dom');
const SchoolScripts = require('./SchoolScripts');
const TuitionScoreCard = require('./TuitionScoreCard.react');

const domready = require('domready');

domready(function () {
  SchoolScripts.loadData();
  ReactDOM.render(<TuitionScoreCard />, document.getElementById('reactex'));
});
