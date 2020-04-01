// eslint-disable-next-line import/no-extraneous-dependencies
import { Menu, dialog } from 'electron'
import { autoUpdater } from 'electron-updater'

import state from '../../state'
import { getMenuTemplate } from '../menu'

const messages = {
  newVersion: {
    id: 'updateNewVersionReady',
    defaultMessage: 'New version is ready!',
  },
  restart: {
    id: 'updateRestart',
    defaultMessage: 'Restart the app to apply the update.',
  },
  later: {
    id: 'updateLater',
    defaultMessage: 'Later',
  },
  restartAndUpdate: {
    id: 'updateRestartAndUpdate',
    defaultMessage: 'Restart and update',
  },
}

export default () => {
  // eslint-disable-next-line global-require
  const { formatMessage } = require('../../i18n')

  autoUpdater.on('update-downloaded', () => {
    state.isUpdateDownloaded = true

    Menu.setApplicationMenu(Menu.buildFromTemplate(getMenuTemplate()))

    dialog.showMessageBox(
      {
        type: 'info',
        title: formatMessage(messages.later),
        message: formatMessage(messages.updateRestart),
        buttons: [
          formatMessage(messages.later),
          formatMessage(messages.restart),
        ],
      },
      buttonIndex => {
        if (buttonIndex === 1) {
          autoUpdater.quitAndInstall()
        }
      },
    )
  })
}
