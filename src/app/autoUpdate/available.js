// eslint-disable-next-line import/no-extraneous-dependencies
import { dialog, shell } from 'electron'
import { autoUpdater } from 'electron-updater'

import { isMas } from '../../constants'

const messages = {
  newVersionAvailable: {
    id: 'updateNewVersion',
    defaultMessage: 'There is a new version available!',
  },
  install: {
    id: 'updateInstall',
    defaultMessage: 'Do you want to install the latest version of Grape now?',
  },
  update: {
    id: 'updateUpdateGrape',
    defaultMessage: 'Update Grape',
  },
  cancel: {
    id: 'updateCancel',
    defaultMessage: 'Cancel',
  },
}

export default () => {
  // eslint-disable-next-line global-require
  const { formatMessage } = require('../../i18n')

  autoUpdater.on('update-available', () => {
    dialog.showMessageBox(
      {
        type: 'info',
        title: formatMessage(messages.newVersionAvailable),
        message: formatMessage(messages.install),
        buttons: [
          formatMessage(messages.cancel),
          formatMessage(messages.update),
        ],
      },
      buttonIndex => {
        if (buttonIndex === 1) {
          if (isMas) {
            shell.openExternal(
              'macappstore://itunes.apple.com/app/chatgrape/id971791845?mt=12',
            )
            return
          }

          autoUpdater.downloadUpdate()
        }
      },
    )
  })
}
