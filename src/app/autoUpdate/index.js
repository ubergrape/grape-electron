import log from 'electron-log'
import { autoUpdater } from 'electron-updater'

import available from './available'
import downloaded from './downloaded'
import notAvailable from './notAvailable'
import error from './error'

export default () => {
  autoUpdater.logger = log
  autoUpdater.logger.transports.file.level = 'debug'
  autoUpdater.autoDownload = true

  autoUpdater.checkForUpdates()

  available()
  downloaded()
  notAvailable()
  error()
}
