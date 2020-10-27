// eslint-disable-next-line import/no-extraneous-dependencies
import { dialog, Menu } from 'electron'
import { autoUpdater } from 'electron-updater'

import { getMenuTemplate } from '../menu'
import state from '../../state'

export default () => {
  autoUpdater.on('error', error => {
    state.isUpdateDownloading = false

    Menu.setApplicationMenu(Menu.buildFromTemplate(getMenuTemplate()))

    dialog.showErrorBox(
      'Error: ',
      error == null ? 'unknown' : (error.stack || error).toString(),
    )
  })
}
