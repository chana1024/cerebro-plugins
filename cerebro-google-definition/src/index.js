import React from 'react'

import Preview from './Preview'
import iconPath from './icon.png'
const childProcess = require('child_process');
const id = 'google defenition'
export const order = 1
export const icon = iconPath
const REGEXP = /ge\s(.*)/;

const queryFromTerm = term => {
  const match = term.match(/^ge (.+)$/)
  return match ? match[1].trim() : null
};
/**
 * Search term in google
 *
 * @param  {String} options.term
 * @param  {Object} options.actions
 * @param  {Function} options.display
 */
export const fn = ({ term, actions, display }) => {
  const match = term.match(REGEXP);
    if (match) {
      const query = queryFromTerm(term)
          /**
           * Open browser with google search of term
           * @param  {String} searchTerm
           */
          // eslint-disable-next-line no-var
          var search = (searchTerm) => {
            // searchTerm = "google definition "+searchTerm
            const q = encodeURIComponent(searchTerm)
            // const url = `https://www.google.com/search?q=${q}&cad=h`
            const url = `https://dictionary.cambridge.org/dictionary/english-chinese-traditional/${q}`
            childProcess.exec(`firefox ${url}`)
          }

          display({
            id,
            icon,
            order,
            title: `Search google definition  for ${query}`,
            onSelect: () => search(query),
            // getPreview: () => <Preview query={query} key={query} search={search} />
              getPreview: () => `<div style="color: #2e69d7; font-size: xx-large; font-family: cursive;">${query}</div>`
          })
    }
}

