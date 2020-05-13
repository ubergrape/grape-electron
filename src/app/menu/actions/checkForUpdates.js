// eslint-disable-next-line import/no-extraneous-dependencies
import { shell } from 'electron'
import { autoUpdater } from 'electron-updater'
import { isWindowsStore } from '../../../constants'

export default () => {
  if (isWindowsStore) {
    shell.openExternal('ms-windows-store://pdp/?ProductId=9P28KPMR8L2Z')
    return
  }

  autoUpdater.autoDownload = false

  autoUpdater.checkForUpdates()
}
