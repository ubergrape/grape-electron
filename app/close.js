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

      storage.has('closeBalloonShown', function(e, hasKey) {
        if (e) throw e

        if (!hasKey) {
          state.trayIcon.displayBalloon({
            icon: paths.icon,
            title: 'Notifications for Grape',
            content: 'You\'ll see notifications for new private messages and mentions here.'
          })

          storage.set(
            'closeBalloonShown',
            {shown: true},
            function(e) {
              if (e) throw(e)
            }
          )
        }
      })
    }
    if (isOSX()) app.hide()
  }
  state.dimensions.saveState(state.mainWindow)
}
