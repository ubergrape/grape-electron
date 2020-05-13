// eslint-disable-next-line import/no-extraneous-dependencies
import { dialog } from 'electron'
import { autoUpdater } from 'electron-updater'

export default () => {
  autoUpdater.on('error', error => {
    dialog.showErrorBox(
      'Error: ',
      error == null ? 'unknown' : (error.stack || error).toString(),
    )
  })
}
