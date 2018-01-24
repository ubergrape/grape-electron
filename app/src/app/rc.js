import path from 'path'
import {app} from 'electron'
import {existsSync} from 'fs'
import loadJson from 'load-json-file'
import {isWindows, isOSX} from './utils'

// Directory where of .app or .exe file lives.
let dir

if (isOSX()) dir = path.normalize(app.getAppPath() + '/../../../..')
else if (isWindows()) dir = path.dirname(app.getPath('exe'))
else console.warn('Implement rc file path.')

console.log("looking for .graperc or graperc file in: " + dir)

let filePath = path.join(dir, '.graperc')
// Alternative file name for windows where can't rename a dotfile apparently.
if (!existsSync(filePath)) filePath = path.join(dir, 'graperc')

let config = {}

if (existsSync(filePath)) {
  try {
    config = loadJson.sync(filePath)
  } catch (err) {
    console.error(err)
  }
}

export default config

