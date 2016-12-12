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

function hookStream(stream, callback) {
  const {write} = stream
  stream.write = function() {
    callback.apply(this, arguments)
    return write.apply(stream, arguments)
  }
}

/**
 * Duplicates stdout and stderr streams into `console.log`.
 * For the case when process is detached from the shell and we need to debug.
 */
export default () => {
  const logFile = normalize(`${app.getPath('userData')}/console.log`)
  const log = fs.createWriteStream(logFile)
  console.log('Using log file', escapePath(logFile))
  hookStream(process.stdout, log.write.bind(log))
}

