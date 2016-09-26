import {app} from 'electron'
import storage from 'electron-json-storage'
import {defineMessages} from 'react-intl'

import state from './state'
import {isWindows, isOSX} from './utils'

import * as imagePaths from '../constants/images'
import {formatMessage} from '../i18n'

const messages = defineMessages({
  balloonTitle: {
    id: 'windowsBalloonOnCloseTitle',
    defaultMessage: 'Notifications for Grape'
  },
  balloonContent: {
    id: 'windowsBalloonOnCloseContent',
    defaultMessage: 'You\'ll see notifications for new private messages and mentions here.'
  }
})

export default function(e) {
  if (!state.dontPreventClose) {
    e.preventDefault()

    if (isWindows()) {
      state.mainWindow.setSkipTaskbar(true)
      state.mainWindow.hide()

      storage.has('closeBalloonShown', (err, hasKey) => {
        if (err) throw err

        if (!hasKey) {
          state.trayIcon.displayBalloon({
            icon: imagePaths.icon,
            title: formatMessage(messages.balloonTitle),
            content: formatMessage(messages.balloonContent)
          })

          storage.set(
            'closeBalloonShown',
            {shown: true},
            setErr => {
              if (setErr) throw setErr
            }
          )
        }
      })
    }
    if (isOSX()) app.hide()
  }
  storage.set('lastUrl', {
    url: state.mainWindow.webContents.getURL(),
    host: state.host
  })
  state.dimensions.saveState(state.mainWindow)
}
