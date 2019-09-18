// eslint-disable-next-line import/no-extraneous-dependencies
import { BrowserWindow, app, screen } from 'electron'
import { white } from 'grape-theme/dist/base-colors'
import path from 'path'

/* eslint-disable import/no-cycle */
import handleNavigation from './handleNavigation'
import handleRedirect from './handleRedirect'
import loadUrl from './loadUrl'
/* eslint-enable import/no-cycle */
import state from '../state'
import { isDevelopment } from '../utils'

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
    show: state.mainWindow && state.isShown,
    backgroundColor: white,
    webPreferences: {
      preload: path.join(__dirname, '../preload/mainWindow.js'),
      nodeIntegration: url.startsWith('file:'),
    },
  })

  mainWindow.once('ready-to-show', () => {
    if ((state.isShown || state.isInitialLoading) && !isDevelopment) {
      mainWindow.show()
    }
    state.isInitialLoading = false
  })

  mainWindow.on('show', () => {
    state.isShown = true
  })

  mainWindow.on('hide', () => {
    state.isShown = false
  })

  mainWindow.webContents.on('new-window', handleNavigation)
  mainWindow.webContents.on('will-navigate', handleNavigation)
  mainWindow.webContents.on('did-navigate', handleRedirect)

  mainWindow.on('close', e => {
    if (app.quitting) {
      state.mainWindow = null
    } else {
      e.preventDefault()
      mainWindow.hide()
    }
  })

  loadUrl(url, mainWindow)

  if (isDevelopment) mainWindow.webContents.openDevTools()

  state.mainWindow = mainWindow
}
