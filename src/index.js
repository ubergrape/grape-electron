// eslint-disable-next-line import/no-extraneous-dependencies
const electron = require('electron')
const path = require('path')
const { autoUpdater } = require('electron-updater')
const minimatch = require('minimatch')
const log = require('electron-log')

const { app, shell, BrowserWindow } = electron

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

const createWindow = () => {
  autoUpdater.checkForUpdatesAndNotify()

  const { width, height } = electron.screen.getPrimaryDisplay().workAreaSize

  mainWindow = new BrowserWindow({
    minHeight: 600,
    minWidth: 800,
    width,
    height,
    show: false,
    backgroundColor: '#FFF',
    webPreferences: {
      contextIsolation: true,
    },
  })

  mainWindow.loadURL('https://uebergrape.staging.chatgrape.com')

  if (process.env.NODE_ENV === 'development')
    mainWindow.webContents.openDevTools()

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

  mainWindow.webContents.on('new-window', (e, url) => {
    e.preventDefault()

    if (minimatch(url, '**/call/*')) {
      secondaryWindow = new BrowserWindow({
        width: 800,
        height: 600,
        parent: mainWindow,
        webPreferences: {
          preload: path.join(__dirname, 'preload/secondaryWindow.js'),
        },
      })

      secondaryWindow.loadURL(url)
      return
    }

    shell.openExternal(url)
  })

  mainWindow.webContents.on('will-navigate', (e, url) => {
    if (shouldOpenIn(mainWindowLinks, url)) return
    shell.openExternal(url)
  })
}

app.on('ready', createWindow)

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
