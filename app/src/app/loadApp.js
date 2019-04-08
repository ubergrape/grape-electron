import { app, BrowserWindow } from 'electron'

import env from './env'
import state from './state'
import close from './close'
import initTray from './initTray'
import loadURL from './loadURL'
import handleLocations from './handleLocations'
import { urls } from '../constants/pages'

export default function loadApp(url = state.getUrl()) {
  state.mainWindow.loadURL(urls.loading)
  state.mainWindow.once('close', () => (state.mainWindow = null))

  const newMain = new BrowserWindow(
    Object.assign({}, state.prefs, {
      show: false,
      webPreferences: {
        nodeIntegration: url.startsWith('file:'),
        nodeIntegrationInWorker: url.startsWith('file:'),
        contextIsolation: !url.startsWith('file:'),
      },
    }),
  )
  loadURL(url, newMain)
  newMain.webContents.once('did-finish-load', () => {
    let hidden = true

    if (state.mainWindow) {
      state.preventClose = false
      state.mainWindow.close()
      state.preventClose = true
      hidden = false
    }

    if (state.prefs.show) {
      if (hidden) {
        app.once('activate', () => newMain.show())
      } else {
        newMain.show()
      }
    } else {
      newMain.minimize()
    }

    state.mainWindow = newMain
    state.mainWindow.on('close', close)
    state.mainWindow.on('hide', () => {
      state.mainWindow.blurWebView()
    })

    if (env.name !== 'production') state.mainWindow.openDevTools()

    if (!state.trayIcon) {
      initTray()
    }
    handleLocations()
  })
}
