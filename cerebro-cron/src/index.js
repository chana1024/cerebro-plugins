/* eslint max-len: [0] */

const { shellCommand, memoize } = require('cerebro-tools');
const pluginIcon = require('./icon.png');
const REGEXP = /kill\s(.*)/;
const LIST_CMD = 'ps -A -o pid -o %cpu -o comm | sed 1d';

const DEFAULT_ICON = '/System/Library/CoreServices/CoreTypes.bundle/Contents/Resources/ExecutableBinaryIcon.icns';

const MEMOIZE_OPTIONS = {
  promise: 'then',
  maxAge: 5 * 1000,
  preFetch: true
}

/**
 * Parse line of ps command
 * @param {String} line of ps result
 * @return {Array} array of processId, processName and processPath
 */
function parsePsResult(str) {
  return str.match(/(\d+)\s+(\d+[\.|,]\d+)\s+(.*)/).slice(1);
}

function getIcon(processPath) {
  const match = processPath.match(/^.*?\.app/);
  // If no .app was found, use OS X's generic 'executable binary' icon.
  return match ? match[0] : DEFAULT_ICON;
}

const findProcess = memoize((searchProcessName) => {
  const regexp = new RegExp(`[^\/]*${searchProcessName}[^\/]*$`, 'i');
  return shellCommand(LIST_CMD).then(result => (
    result
      .split('\n')
      .filter(line => line.match(regexp))
      .map(str => {
        const [id, cpu, path] = parsePsResult(str);
        const icon = getIcon(path);
        const title = path.match(regexp)[0];
        return { id, title, cpu, path, icon };
      })
      .sort((a, b) =>
        -a.cpu > -b.cpu ? 1 : (-a.cpu < -b.cpu ? -1 : 0)
      )
    )
  )
}, MEMOIZE_OPTIONS);

/**
 * Plugin to look and display local and external IPs
 *
 * @param  {String} options.term
 * @param  {Function} options.display
 */
const fn = ({term, display}) => {
    const results={
        order:11,
        title: `cron expression`,
        getPreview: () => "<embed style='width:900px;height: 728px' type='text/html'  src='http://cron.ciding.cc/'>"
    }
    display(results);
};

module.exports = {
  name: 'cron expression',
  keyword: 'cron',
  icon: pluginIcon,
  fn
};
