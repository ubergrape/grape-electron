// This is main process of Electron, started as first thing when your
// app starts. This script is running through entire life of your application.
// It doesn't have any windows which you can see on screen, but we can open
// window from here.
// eslint-disable-next-line import/no-extraneous-dependencies
import { app } from 'electron'
import url from 'url'

import '../electron/setDataDirs'
import logToFile from './logToFile'
import ensureFocus from './ensureFocus'

import { register as registerProtocol, protocol } from './protocolHandler'
import { register as registerShortcuts } from './shortcuts'
import { isWindows } from './utils'
import initApp from './initApp'

const event = {
  isFake: true,
  preventDefault: () => null,
}

const init = () => {
  logToFile()
  registerProtocol()

  app.on('second-instance', (e, argv) => {
    const isFocused = ensureFocus()
    if (!isFocused) return

    // On windows we have to check the second instance arguments to emit the open-url event.
    if (isWindows()) {
      const matchesProtocol = str => url.parse(str).protocol === `${protocol}:`
      // Check if the second instance was attempting to launch a URL for our protocol client.
      const matchedUrl = argv.find(matchesProtocol)
      if (matchedUrl) app.emit('open-url', event, url)
    }
  })

  app.once('ready', () => {
    initApp()
    registerShortcuts()
  })
}

const gotTheLock = app.requestSingleInstanceLock()
if (!gotTheLock) app.quit()
else init()
