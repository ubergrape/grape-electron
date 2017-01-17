import {app} from 'electron'
import fs from 'fs'
import {normalize} from 'path'

import {isWindows} from './utils'

/**
 * Escapes a path so that it can be printed to console on windows and mac in
 * a usable form to copy paste it in the shell.
 */
function escapePath(path) {
  const escapeChar = isWindows() ? '^' : '\\'
  return path.replace(/( |\(|\))/g, `${escapeChar}$1`)
}

function wrap(src, method, callback) {
  const target = src[method]
  src[method] = function() {
    callback.apply(this, arguments)
    return target.apply(src, arguments)
  }
}

/**
 * Duplicates stdout and stderr streams into `console.log`.
 * For the case when process is detached from the shell and we need to debug.
 */
export default () => {
  const logFile = normalize(`${app.getPath('userData')}/console.log`)
  const log = fs.createWriteStream(logFile)

  log.once('open', () => {
    console.log('Using log file', escapePath(logFile))

    if (isWindows()) {
      wrap(console, 'log', log.write.bind(log))
      return
    }
    wrap(process.stdout, 'write', log.write.bind(log))
  })
}
