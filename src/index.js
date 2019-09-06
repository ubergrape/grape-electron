/* eslint-disable import/no-extraneous-dependencies */
import { app } from 'electron'
import electronReload from 'electron-reload'
/* eslint-enable import/no-extraneous-dependencies */
import path from 'path'
import log from 'electron-log'
import { autoUpdater } from 'electron-updater'

import initApp from './utils/initApp'
import urls from './constants/pages'
import state from './state'
import isDevelopment from './utils/isDevelopment'

autoUpdater.logger = log
autoUpdater.logger.transports.file.level = 'debug'

app.allowRendererProcessReuse = true

const init = () => {
  if (isDevelopment) {
    // eslint-disable-next-line global-require, import/no-extraneous-dependencies
    electronReload(__dirname, {
      electron: path.join(__dirname, '../node_modules/.bin/electron'),
    })
  }

  app.on('ready', () => initApp(urls.about))

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
  })

  app.on('before-quit', () => {
    app.quitting = true
  })

  app.on('activate', () => {
    state.mainWindow.show()
  })

  autoUpdater.on('error', err => {
    log.error(err)
  })
}

const gotTheLock = app.requestSingleInstanceLock()

if (!gotTheLock) {
  app.quit()
} else {
  app.on('second-instance', () => {
    if (state.mainWindow) {
      if (state.mainWindow.isMinimized()) state.mainWindow.restore()
      state.mainWindow.focus()
    }
  })

  init()
}
