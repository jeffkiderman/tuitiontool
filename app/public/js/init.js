'use strict';
// @flow

const React = require('react');
const ReactDOM = require('react-dom');
const SchoolScripts = require('./SchoolScripts');
const TuitionToolRoot = require('./TuitionToolRoot.react');

const domready = require('domready');

domready(function () {
  SchoolScripts.loadData();
  ReactDOM.render(
    <TuitionToolRoot />,
    document.getElementById('react-root')
  );
});
