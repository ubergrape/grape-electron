// This is main process of Electron, started as first thing when your
// app starts. This script is running through entire life of your application.
// It doesn't have any windows which you can see on screen, but we can open
// window from here.
import {app} from 'electron'

import logToFile from './logToFile'
import {register as registerProtocol} from './protocolHandler'
import {register as registerShortcuts} from './shortcuts'
import makeSingleInstance from './makeSingleInstance'
import initApp from './initApp'

function init() {
  logToFile()
  registerProtocol()

  app.once('ready', () => {
    initApp()
    registerShortcuts()
  })
}

const shouldQuit = makeSingleInstance()
if (shouldQuit) app.quit()
else init()
