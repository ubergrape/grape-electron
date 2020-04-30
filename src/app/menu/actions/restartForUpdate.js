import { autoUpdater } from 'electron-updater'

export default () => {
  setImmediate(() => {
    autoUpdater.quitAndInstall()
  })
}
