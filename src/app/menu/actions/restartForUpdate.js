// eslint-disable-next-line import/no-extraneous-dependencies
import { app, dialog } from 'electron'
import { autoUpdater } from 'electron-updater'

export default () => {
  try {
    autoUpdater.quitAndInstall()
    setTimeout(() => {
      app.relaunch()
      app.exit(0)
    }, 6000)
  } catch (e) {
    dialog.showErrorBox('Error', 'Failed to install updates')
  }
}
