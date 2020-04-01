// eslint-disable-next-line import/no-extraneous-dependencies
import { shell } from 'electron'
import { autoUpdater } from 'electron-updater'
import { isMas } from '../../../constants'

export default () => {
  if (isMas) {
    shell.openExternal(
      'macappstore://itunes.apple.com/app/chatgrape/id971791845?mt=12',
    )
    return
  }

  autoUpdater.autoDownload = false

  autoUpdater.checkForUpdates()
}
