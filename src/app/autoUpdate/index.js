import log from 'electron-log'
import { autoUpdater } from 'electron-updater'

import state from '../../state'
import available from './available'
import downloaded from './downloaded'
import notAvailable from './notAvailable'
import error from './error'

export default () => {
  autoUpdater.channel = 'latest'
  autoUpdater.logger = log
  autoUpdater.logger.transports.file.level = 'debug'
  autoUpdater.autoDownload = true

  state.isInitialUpdateCheck = true
  autoUpdater.checkForUpdates().then(() => {
    state.isInitialUpdateCheck = false
  })

  available()
  downloaded()
  notAvailable()
  error()
}
