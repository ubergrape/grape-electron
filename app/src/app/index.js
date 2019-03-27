// This is main process of Electron, started as first thing when your
// app starts. This script is running through entire life of your application.
// It doesn't have any windows which you can see on screen, but we can open
// window from here.

// eslint-disable-next-line import/no-extraneous-dependencies
import { app } from 'electron'
import '../electron/setDataDirs'
import logToFile from './logToFile'
import state from './state'
import { register as registerProtocol } from './protocolHandler'
import { register as registerShortcuts } from './shortcuts'
import initApp from './initApp'

function init() {
  logToFile()
  registerProtocol()

  app.once('ready', () => {
    initApp()
    registerShortcuts()
  })
}

const gotTheLock = app.requestSingleInstanceLock()

if (!gotTheLock) {
  app.quit()
} else {
  app.on('second-instance', () => {
    // Someone tried to run a second instance, we should focus our window.
    if (state.myWindow) {
      if (state.myWindow.isMinimized()) state.myWindow.restore()
      state.myWindow.focus()
    }
  })

  init()
}
