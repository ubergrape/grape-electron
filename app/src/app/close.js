import {app} from 'electron'
import storage from 'electron-json-storage'
import {defineMessages} from 'react-intl'
import {parse as parseUrl} from 'url'

import state from './state'
import {isWindows, isOSX} from './utils'

import {urls} from '../constants/pages'
import {chat as chatPath} from '../constants/paths'
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
  if (state.preventClose) {
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
  const lastUrl = state.mainWindow.webContents.getURL()
  const isLastUrlChat = (
    parseUrl(lastUrl)
      .pathname
      .split('/')
      .filter(p => p !== '')[0]
  ) === chatPath

  storage.set('lastUrl', {
    url: isLastUrlChat ? lastUrl : false,
    host: state.host
  })
  state.dimensions.saveState(state.mainWindow)
}
