// eslint-disable-next-line import/no-extraneous-dependencies
import { BrowserWindow, app, screen } from 'electron'
import { white } from 'grape-theme/dist/base-colors'

import state from '../state'
import handleNavigation from './handleNavigation'
import isDevelopment from '../utils/isDevelopment'

export default url => {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize

  if (state.mainWindow) state.mainWindow.close()
  else {
    state.isShown = false
    state.isInitialLoading = true
  }

  const mainWindow = new BrowserWindow({
    minHeight: 600,
    minWidth: 800,
    width,
    height,
    show: (!!state.mainWindow && state.isShown) || !isDevelopment,
    backgroundColor: white,
    webPreferences: {
      nodeIntegration: url.startsWith('file:'),
      contextIsolation: !url.startsWith('file:'),
    },
  })

  mainWindow.loadURL(url)

  mainWindow.once('ready-to-show', () => {
    if ((state.isShown || state.isInitialLoading) && !isDevelopment) {
      mainWindow.show()
    }
    state.isInitialLoading = false
  })

  mainWindow.once('show', () => {
    state.isShown = true
  })

  mainWindow.once('hide', () => {
    state.isShown = false
  })

  mainWindow.webContents.on('new-window', handleNavigation)
  mainWindow.webContents.on('will-navigate', handleNavigation)

  mainWindow.on('close', e => {
    if (app.quitting) {
      state.mainWindow = null
    } else {
      e.preventDefault()
      mainWindow.hide()
    }
  })

  state.mainWindow = mainWindow
}
