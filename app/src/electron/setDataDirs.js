import { app } from 'electron'
import path from 'path'

if (process.platform == 'win32') {
  app.setPath('appData', process.env.LOCALAPPDATA)
  app.setPath('userData', path.join(process.env.LOCALAPPDATA, app.getName()))
}
