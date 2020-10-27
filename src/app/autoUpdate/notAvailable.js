// eslint-disable-next-line import/no-extraneous-dependencies
import { dialog, Menu } from 'electron'
import { autoUpdater } from 'electron-updater'

import state from '../../state'
import { getMenuTemplate } from '../menu'

const messages = {
  upToDate: {
    id: 'updateUpToDate',
    defaultMessage: "You're up to date!",
  },
  latest: {
    id: 'updateLatest',
    defaultMessage: "You're already using the latest version of Grape.",
  },
  ok: {
    id: 'updateOk',
    defaultMessage: 'OK',
  },
}

export default () => {
  // eslint-disable-next-line global-require
  const { formatMessage } = require('../../i18n')

  autoUpdater.on('update-not-available', () => {
    if (state.isInitialUpdateCheck) return

    state.isUpdateDownloading = false
    Menu.setApplicationMenu(Menu.buildFromTemplate(getMenuTemplate()))

    dialog.showMessageBox({
      type: 'info',
      title: formatMessage(messages.upToDate),
      message: formatMessage(messages.latest),
      buttons: [formatMessage(messages.ok)],
    })
  })
}
