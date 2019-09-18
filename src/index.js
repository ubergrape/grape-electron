// eslint-disable-next-line import/no-extraneous-dependencies
import { app } from 'electron'
import electronReload from 'electron-reload'
import path from 'path'
import log from 'electron-log'
import { autoUpdater } from 'electron-updater'

import initApp from './app/initApp'
import state from './state'
import store from './store'
import { isDevelopment, getUrlToLoad } from './utils'

autoUpdater.logger = log
autoUpdater.logger.transports.file.level = 'debug'

app.allowRendererProcessReuse = true

const init = () => {
  if (isDevelopment) {
    electronReload(__dirname, {
      electron: path.join(__dirname, '../node_modules/.bin/electron'),
    })
  }

  app.on('ready', () => {
    initApp(getUrlToLoad(store))
  })

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
  })

  app.on('before-quit', () => {
    store.set('lastUrl', state.mainWindow.webContents.getURL())
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
