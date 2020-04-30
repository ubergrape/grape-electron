// eslint-disable-next-line import/no-extraneous-dependencies
import { dialog, session } from 'electron'

import store from '../../../store'
import env from '../../../env'
import loadUrl from '../../loadUrl'
import { pages } from '../../../constants'

const messages = {
  logOutTitle: {
    id: 'logOutTitle',
    defaultMessage: 'Are you sure you want to log out?',
  },
  logOutCancel: {
    id: 'logOutCancel',
    defaultMessage: 'Cancel',
  },
  logOutConfirm: {
    id: 'logOutAction',
    defaultMessage: 'Log out',
  },
}

const clearSessionData = () => {
  const webviewSession = session.fromPartition('persist:webview')

  webviewSession.clearStorageData().then(() => {
    loadUrl(pages.domain)
  })
}

export default () => {
  // eslint-disable-next-line global-require
  const { formatMessage } = require('../../../i18n')

  dialog
    .showMessageBox({
      type: 'info',
      message: formatMessage(messages.logOutTitle),
      buttons: [
        formatMessage(messages.logOutCancel),
        formatMessage(messages.logOutConfirm),
      ],
    })
    .then(({ response }) => {
      if (response === 1) {
        store.clear()
        store.set(env)
        clearSessionData()
      }
    })
}
