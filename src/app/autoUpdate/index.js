import log from 'electron-log'
import { autoUpdater } from 'electron-updater'

import state from '../../state'
import store from '../../store'
import available from './available'
import downloaded from './downloaded'
import notAvailable from './notAvailable'
import error from './error'

export default () => {
  autoUpdater.logger = log
  autoUpdater.logger.transports.file.level = 'debug'
  autoUpdater.autoDownload = true
  autoUpdater.allowPrerelease = store.get('allowPrerelease')

  state.isInitialUpdateCheck = true
  autoUpdater.checkForUpdates().then(() => {
    state.isInitialUpdateCheck = false
  })

  available()
  downloaded()
  notAvailable()
  error()
}
