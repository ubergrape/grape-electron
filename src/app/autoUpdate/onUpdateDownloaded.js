// eslint-disable-next-line import/no-extraneous-dependencies
import { Menu, dialog } from 'electron'

import quitAndInstall from './quitAndInstall'
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
        quitAndInstall()
      }
    })
}
