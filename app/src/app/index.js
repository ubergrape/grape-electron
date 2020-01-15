// This is main process of Electron, started as first thing when your
// app starts. This script is running through entire life of your application.
// It doesn't have any windows which you can see on screen, but we can open
// window from here.

// eslint-disable-next-line import/no-extraneous-dependencies
import { app } from 'electron'
import log from 'electron-log'
import '../electron/setDataDirs'
import state from './state'
import { register as registerProtocol } from './protocolHandler'
import { register as registerShortcuts } from './shortcuts'
import showMainWindow from './menu/actions/showMainWindow'
import initApp from './initApp'

function init() {
  registerProtocol()

  app.once('ready', launchInfo => {
    log.info('ready', JSON.stringify(launchInfo))
    initApp()
    registerShortcuts()
  })
}

// https://github.com/electron/electron/issues/15958
if (process.mas) {
  init()
} else {
  const gotTheLock = app.requestSingleInstanceLock()

  if (!gotTheLock) {
    app.quit()
  } else {
    app.on('second-instance', (e, argv, workingDirectory) => {
      log.info('second-instance', argv, workingDirectory)
      // Someone tried to run a second instance, we should focus our window.
      if (state.mainWindow) {
        if (state.mainWindow.isMinimized()) state.mainWindow.restore()
        showMainWindow()
      }
    })

    init()
  }
}
