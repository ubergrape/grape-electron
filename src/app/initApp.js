import { autoUpdater } from 'electron-updater'

import state from '../state'
import loadApp from './loadApp'
import isDevelopment from '../utils/isDevelopment'

export default url => {
  autoUpdater.checkForUpdatesAndNotify()

  loadApp(url)

  if (isDevelopment) state.mainWindow.webContents.openDevTools()
}
