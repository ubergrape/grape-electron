const electron = require('electron')
const path = require('path')
const { autoUpdater } = require('electron-updater')

const { app, BrowserWindow } = electron

autoUpdater.logger = require("electron-log")
autoUpdater.logger.transports.file.level = "debug"

let mainWindow

const createWindow = () => {
  autoUpdater.checkForUpdatesAndNotify()

  const { width, height } = electron.screen.getPrimaryDisplay().workAreaSize

  mainWindow = new BrowserWindow({
    'minHeight': 600,
    'minWidth': 800,
    width,
    height,
    webPreferences: {
      contextIsolation: true,
    }
  })

  mainWindow.loadURL('https://chatgrape.com/chat')

  if (process.env.NODE_ENV === 'development') mainWindow.webContents.openDevTools()

  mainWindow.on('close', e => {
    if (app.quitting) {
      mainWindow = null
    } else {
      e.preventDefault()
      mainWindow.hide()
    }
  });
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

app.on('before-quit', () => app.quitting = true)

app.on('activate', () => {
  mainWindow.show()
})
