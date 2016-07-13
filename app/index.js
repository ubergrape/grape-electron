// This is main process of Electron, started as first thing when your
// app starts. This script is running through entire life of your application.
// It doesn't have any windows which you can see on screen, but we can open
// window from here.

import {
  isNotificationSupported,
  isWindows,
  isOSX,
  isExternalUrl
} from './utils'

import {
  app,
  BrowserWindow,
  ipcMain,
  nativeImage,
  systemPreferences
} from 'electron'

// Special module holding environment variables which you declared
// in config/env_xxx.json file.
import env from './env'
import state from './state'
import storage from 'electron-json-storage'
import contextMenu from 'electron-context-menu'
import windowStateKeeper from './vendor/electron_boilerplate/window_state'
import showMainWindow from './showMainWindow'
import * as paths from './paths'
import * as menu from './menu'
import quit from './quit'
import close from './close'
import initTray from './initTray'
import setOpenLinksInDefaultBrowser from './setOpenLinksInDefaultBrowser'
import loadURL from './loadURL'
import handleOffline from './handleOffline'

contextMenu()

// Preserver of the window size and position between app launches.
state.dimensions = windowStateKeeper('main', {
  width: 1075,
  height: 1000
})

const shouldQuit = app.makeSingleInstance(() => {
  const {mainWindow} = state
  // Someone tried to run a second instance, we should focus our window
  if (mainWindow) showMainWindow()
  return true
})

if (shouldQuit) quit()

app.on('ready', () => {
    // set global to be accessible from webpage
    global.isNotificationSupported = isNotificationSupported()

    const prefs = Object.assign(
      {},
      state.dimensions,
      {
        webPreferences: {
          allowDisplayingInsecureContent: true
        }
      }
    )
    state.mainWindow = new BrowserWindow(prefs)
    state.mainWindow.loadURL(`file://${__dirname}/html/loading.html`)
    state.mainWindow.once('close', () => state.mainWindow = null)

    const {webContents} = state.mainWindow
    webContents.once('will-navigate', handleOffline.bind(null, undefined))

    if (env.name === 'test') {
      state.mainWindow.loadURL(`file://${__dirname}/spec.html`)
    } else {

      const newMain = new BrowserWindow(Object.assign({}, prefs, {show: false}))

      storage.get('lastUrl', (error, data) => {
        let url = env.host
        if (
          !error &&
          data &&
          data.url &&
          !isExternalUrl(data.url, url)
        ) url = data.url
        newMain.loadURL(url)
        newMain.webContents.once('did-finish-load', () => {
          let hidden = true

          if (state.mainWindow) {
            state.mainWindow.close()
            hidden = false
          }

          if (hidden) {
            app.once('activate', () => newMain.show())
          } else {
            newMain.show()
          }

          state.mainWindow = newMain
          state.mainWindow.on('close', close)
          state.mainWindow.on('hide', () => {
            state.mainWindow.blurWebView()
          })

          if (env.name !== 'production') state.mainWindow.openDevTools()

          initTray()
          setOpenLinksInDefaultBrowser()
        })
      })
    }

    if (state.dimensions.isMaximized) {
      state.mainWindow.maximize()
    }

    const Menu = state.Menu = require('electron').Menu
    Menu.setApplicationMenu(Menu.buildFromTemplate(menu.main))
})

app.on('window-all-closed', () => {})
app.on('before-quit', () => {
  state.dontPreventClose = true
})

app.on('certificate-error', (e, webContents, url, error, certificate, callback) => {
    if (url.indexOf('staging.chatgrape.com') > -1) {
      e.preventDefault()
      callback(true)
    } else {
      callback(false)
    }
})

if (isOSX()) {
  systemPreferences.subscribeNotification('AppleInterfaceThemeChangedNotification', () => {
    let icon = paths[systemPreferences.isDarkMode() ? 'trayWhiteIcon' : 'trayIcon']
    state.trayIcon.setImage(icon)
  })
}

ipcMain.on('addBadge', (e, badge) => {
  if (isWindows()) {
    state.mainWindow.setOverlayIcon(
      paths.statusBarOverlay,
      (badge + ' unread channel' + (parseInt(badge) > 1 ? 's' : ''))
    )
  } else {
    state.trayIcon.setImage(paths.trayBlueIcon)
    if (app.dock) app.dock.setBadge(String(badge))
  }
})

ipcMain.on('removeBadge', () => {
  const {trayIcon, mainWindow} = state
  if (isWindows()) {
    mainWindow.setOverlayIcon(nativeImage.createEmpty(), '')
  }

  if (isOSX()) {
    let icon = paths[systemPreferences.isDarkMode() ? 'trayWhiteIcon' : 'trayIcon']
    trayIcon.setImage(icon)
    if (app.dock) app.dock.setBadge('')
  }
})

ipcMain.on('showNotification', (e, notification) => {
  const {trayIcon} = state
  trayIcon.displayBalloon({
    icon: paths.icon,
    title: notification.title,
    content: notification.message
  })
  trayIcon.once('balloon-click', () => {
    e.sender.send(String(notification.event))
  })
})

ipcMain.on('loadChat', (e, notification) => {
  loadURL(env.host)
})
