// eslint-disable-next-line import/no-extraneous-dependencies
import { dialog, shell, Menu } from 'electron'
import { autoUpdater } from 'electron-updater'
import { getMenuTemplate } from '../menu'

import state from '../../state'
import { isWindowsStore } from '../../constants'

const messages = {
  newVersionAvailable: {
    id: 'updateNewVersion',
    defaultMessage: 'There is a new version available!',
  },
  install: {
    id: 'updateInstall',
    defaultMessage: 'Do you want to install the latest version of Grape now?',
  },
  cancel: {
    id: 'updateCancel',
    defaultMessage: 'Cancel',
  },
  update: {
    id: 'updateUpdateGrape',
    defaultMessage: 'Update Grape',
  },
}

export default () => {
  // eslint-disable-next-line global-require
  const { formatMessage } = require('../../i18n')

  autoUpdater.on('update-available', () => {
    if (state.isInitialUpdateCheck) return

    dialog
      .showMessageBox({
        type: 'question',
        title: formatMessage(messages.newVersionAvailable),
        message: formatMessage(messages.install),
        buttons: [
          formatMessage(messages.cancel),
          formatMessage(messages.update),
        ],
      })
      .then(({ response }) => {
        if (response === 1) {
          if (isWindowsStore) {
            shell.openExternal('ms-windows-store://pdp/?ProductId=9P28KPMR8L2Z')
            return
          }

          state.isUpdateDownloading = true

          Menu.setApplicationMenu(Menu.buildFromTemplate(getMenuTemplate()))

          autoUpdater.downloadUpdate()
        }
      })
  })
}
