// eslint-disable-next-line import/no-extraneous-dependencies
import { Menu } from 'electron'
import log from 'electron-log'
import { autoUpdater } from 'electron-updater'

import state from '../../state'
import store from '../../store'
import { getMenuTemplate } from '../menu'
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
  state.isUpdateDownloading = true
  Menu.setApplicationMenu(Menu.buildFromTemplate(getMenuTemplate()))

  autoUpdater.checkForUpdates().then(() => {
    state.isInitialUpdateCheck = false
    state.isUpdateDownloading = false
    Menu.setApplicationMenu(Menu.buildFromTemplate(getMenuTemplate()))
  })

  available()
  downloaded()
  notAvailable()
  error()
}
