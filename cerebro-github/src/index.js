'use strict';
const React = require('react');
const icon = require('./GitHub-Mark-64px.png');
const Preview = require('./preview');

const githubPlugin = ({term, display, actions}) => {
  display({
    id: 'github',
    icon,
    order: 12,
    title: `Search github for ${term}`,
    getPreview: () => <Preview term={term} />
  })
};

module.exports = {
  fn: githubPlugin,
  name: 'Search on Github',
  icon
};
