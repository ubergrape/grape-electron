// eslint-disable-next-line import/no-extraneous-dependencies
import { app, screen, shell, BrowserWindow } from 'electron'
import { autoUpdater } from 'electron-updater'
import minimatch from 'minimatch'
import log from 'electron-log'

import urls from './constants/pages'

autoUpdater.logger = log
autoUpdater.logger.transports.file.level = 'debug'

app.allowRendererProcessReuse = true

let mainWindow
let secondaryWindow
let isShown
let isInitialLoading

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

const createWindow = loadUrl => {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize

  if (mainWindow) mainWindow.close()
  else {
    isShown = false
    isInitialLoading = true
  }

  mainWindow = new BrowserWindow({
    minHeight: 600,
    minWidth: 800,
    width,
    height,
    show: !!mainWindow && isShown,
    backgroundColor: '#FFF',
    webPreferences: {
      nodeIntegration: loadUrl.startsWith('file:'),
      contextIsolation: !loadUrl.startsWith('file:'),
    },
  })

  mainWindow.loadURL(loadUrl)

  mainWindow.once('ready-to-show', () => {
    if (isShown || isInitialLoading) mainWindow.show()
    isInitialLoading = false
  })

  mainWindow.once('show', () => {
    isShown = true
  })

  mainWindow.once('hide', () => {
    isShown = false
  })

  mainWindow.webContents.on('new-window', handleNavigation)
  mainWindow.webContents.on('will-navigate', handleNavigation)

  mainWindow.on('close', e => {
    if (app.quitting) {
      mainWindow = null
    } else {
      e.preventDefault()
      mainWindow.hide()
    }
  })
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
