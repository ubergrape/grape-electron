// eslint-disable-next-line import/no-extraneous-dependencies
import { app, Menu, dialog } from 'electron'
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

    dialog
      .showMessageBox({
        type: 'info',
        title: formatMessage(messages.newVersion),
        message: formatMessage(messages.restart),
        buttons: [
          formatMessage(messages.later),
          formatMessage(messages.restartAndUpdate),
        ],
      })
      .then(({ response }) => {
        if (response === 1) {
          setImmediate(() => {
            app.removeAllListeners('window-all-closed')
            if (state.mainWindow) {
              state.mainWindow.close()
            }
            if (state.secondaryWindow) {
              state.secondaryWindow.close()
            }
            autoUpdater.quitAndInstall()
          })
        }
      })
  })
}
