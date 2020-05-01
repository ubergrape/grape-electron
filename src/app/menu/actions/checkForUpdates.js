// eslint-disable-next-line import/no-extraneous-dependencies
import { shell } from 'electron'
import { autoUpdater } from 'electron-updater'
import { isMas, isWindowsStore } from '../../../constants'

export default () => {
  if (isMas) {
    shell.openExternal(
      'macappstore://itunes.apple.com/app/chatgrape/id971791845?mt=12',
    )
    return
  }

  if (isWindowsStore) {
    shell.openExternal('ms-windows-store://pdp/?ProductId=9P28KPMR8L2Z')
    return
  }

  autoUpdater.autoDownload = false

  autoUpdater.checkForUpdates()
}
