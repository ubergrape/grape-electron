// eslint-disable-next-line import/no-extraneous-dependencies
import { app, screen, shell, BrowserWindow } from 'electron'
import { autoUpdater } from 'electron-updater'
import minimatch from 'minimatch'
import log from 'electron-log'

import urls from './constants/pages'

autoUpdater.logger = log
autoUpdater.logger.transports.file.level = 'debug'

let mainWindow
let secondaryWindow

const mainWindowLinks = [
  'file://**',
  '**/accounts/organization/dashboard*',
  '**/chat',
  '**/chat/**',
  '**/accounts/**',
  '**/accounts.google.com/**',
  '**/github.com/login**',
]

const shouldOpenIn = (globs, url) => globs.some(glob => minimatch(url, glob))

const createWindow = loadUrl => {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize

  if (mainWindow) mainWindow.close()

  mainWindow = new BrowserWindow({
    minHeight: 600,
    minWidth: 800,
    width,
    height,
    show: !!mainWindow,
    backgroundColor: '#FFF',
    webPreferences: {
      nodeIntegration: loadUrl.startsWith('file:'),
      contextIsolation: !loadUrl.startsWith('file:'),
    },
  })

  mainWindow.loadURL(loadUrl)

  mainWindow.on('close', e => {
    if (app.quitting) {
      mainWindow = null
    } else {
      e.preventDefault()
      mainWindow.hide()
    }
  })

  mainWindow.once('ready-to-show', () => {
    mainWindow.show()
  })

  const handleNavigation = (e, url) => {
    if (shouldOpenIn(mainWindowLinks, url)) return

    e.preventDefault()

    if (minimatch(url, '**/call/*')) {
      secondaryWindow = new BrowserWindow({
        width: 800,
        height: 600,
        parent: mainWindow,
        webPreferences: {
          preload: `${__dirname}/preload/secondaryWindow.js`,
        },
      })

      secondaryWindow.loadURL(url)
      return
    }

    shell.openExternal(url)
  }

  mainWindow.webContents.on('new-window', handleNavigation)
  mainWindow.webContents.on('will-navigate', handleNavigation)
}

const initApp = url => {
  autoUpdater.checkForUpdatesAndNotify()

  createWindow(url)

  setTimeout(() => {
    createWindow('https://uebergrape.staging.chatgrape.com')
  }, 5000)

  if (process.env.NODE_ENV === 'development')
    mainWindow.webContents.openDevTools()
}

app.on('ready', () => initApp(urls.index))

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

app.on('before-quit', () => {
  app.quitting = true
})

app.on('activate', () => {
  mainWindow.show()
})

autoUpdater.on('error', err => {
  log.error(err)
})
