'use strict'
// @flow

const React = require('react');

class Footer extends React.Component {
  render() {
    return <div className="footer-text">
      <div>
        Email comments and corrections to
        {' '}<a href="mailto:info@ajeproject.org">info@ajeproject.org</a>
      </div>
      <div>
        Copyright {'\u00A9'} {new Date().getFullYear()+' '}
        Affordable Jewish Education Project
      </div>
    </div>
  }
}

module.exports = Footer;
