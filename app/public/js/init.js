'use strict';
// @flow

const React = require('react');
const ReactDOM = require('react-dom');
const TuitionToolRoot = require('./TuitionToolRoot.react');

const domready = require('domready');

domready(function () {
  ReactDOM.render(
    <TuitionToolRoot />,
    document.getElementById('react-root')
  );
});
