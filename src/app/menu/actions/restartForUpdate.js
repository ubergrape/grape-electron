import { app, autoUpdater } from 'electron-updater'

export default () => {
  setImmediate(() => {
    app.removeAllListeners('window-all-closed')
    autoUpdater.quitAndInstall()
  })
}
