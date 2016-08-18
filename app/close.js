import {app} from 'electron'

import state from './state'
import {isWindows, isOSX} from './utils'

import * as paths from './paths'
import storage from 'electron-json-storage'

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
            icon: paths.icon,
            title: 'Notifications for Grape',
            content: 'You\'ll see notifications for new private messages and mentions here.'
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
