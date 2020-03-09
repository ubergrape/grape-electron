import { autoUpdater } from 'electron-updater'

export default () => {
  autoUpdater
    .checkForUpdates()
    .then((updateInfo, downloadPromise, cancellationToken, versionInfo) => {
      // eslint-disable-next-line no-console
      console.log(updateInfo, downloadPromise, cancellationToken, versionInfo)
    })
}
