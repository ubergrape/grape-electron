// eslint-disable-next-line import/no-extraneous-dependencies
import { autoUpdater } from 'electron-updater'

export default () => {
  autoUpdater.quitAndInstall()
}
