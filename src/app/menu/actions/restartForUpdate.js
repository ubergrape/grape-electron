// eslint-disable-next-line import/no-extraneous-dependencies
import { app } from 'electron'
import { autoUpdater } from 'electron-updater'

export default () => {
  setImmediate(() => {
    app.removeAllListeners('window-all-closed')
    autoUpdater.quitAndInstall()
  })
}
