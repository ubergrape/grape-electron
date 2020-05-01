// eslint-disable-next-line import/no-extraneous-dependencies
import { app, BrowserWindow } from 'electron'
import { autoUpdater } from 'electron-updater'

export default () => {
  setImmediate(() => {
    app.removeAllListeners('window-all-closed')

    const browserWindows = BrowserWindow.getAllWindows()
    browserWindows.forEach(browserWindow => {
      browserWindow.removeAllListeners('close')
      browserWindow.close()
    })

    autoUpdater.quitAndInstall()
  })
}
