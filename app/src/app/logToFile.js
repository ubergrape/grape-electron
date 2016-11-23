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

/**
 * Writes all stdout and stderr into console.log file in the root.
 */
export default () => {
  const logFile = normalize(`${app.getPath('userData')}/console.log`)
  const log = fs.createWriteStream(logFile)
  console.log('Using log file', escapePath(logFile))
  process.stderr.write = process.stdout.write = log.write.bind(log)
}
