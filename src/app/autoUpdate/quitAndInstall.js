// eslint-disable-next-line import/no-extraneous-dependencies
import { app, BrowserWindow } from 'electron'
import { autoUpdater } from 'electron-updater'

import state from '../../state'

export default () => {
  setImmediate(() => {
    app.removeAllListeners('window-all-closed')

    const browserWindows = BrowserWindow.getAllWindows()
    browserWindows.forEach(browserWindow => {
      browserWindow.removeAllListeners('close')
      browserWindow.close()
    })

    // As quitAndInstall method from autoUpdate closing app firstly and only after will emit `before-quit`.
    // https://www.electron.build/auto-update.html#module_electron-updater.AppUpdater+quitAndInstall
    state.mainWindow = null

    autoUpdater.quitAndInstall()
  })
}
