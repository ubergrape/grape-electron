// eslint-disable-next-line import/no-extraneous-dependencies
import { shell, Menu } from 'electron'
import { autoUpdater } from 'electron-updater'

import state from '../../../state'
import { isWindowsStore } from '../../../constants'
// eslint-disable-next-line import/no-cycle
import { getMenuTemplate } from '..'

export default () => {
  if (isWindowsStore) {
    shell.openExternal('ms-windows-store://pdp/?ProductId=9P28KPMR8L2Z')
    return
  }

  autoUpdater.autoDownload = false

  state.isUpdateDownloading = true
  Menu.setApplicationMenu(Menu.buildFromTemplate(getMenuTemplate()))

  autoUpdater.checkForUpdates()
}
