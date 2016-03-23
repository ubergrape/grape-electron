// This is main process of Electron, started as first thing when your
// app starts. This script is running through entire life of your application.
// It doesn't have any windows which you can see on screen, but we can open
// window from here.
import {
  isNotificationSupported,
  isWindows,
  isOSX
} from './utils'

import {
  app,
  BrowserWindow,
  ipcMain,
  nativeImage
} from 'electron'

// Special module holding environment variables which you declared
// in config/env_xxx.json file.
import env from './env'
import state from './state'
import windowStateKeeper from './vendor/electron_boilerplate/window_state'
import * as paths from './paths'
import * as menu from './menu'
import quit from './quit'
import close from './close'
import initTray from './initTray'
import setOpenLinksInDefaultBrowser from './setOpenLinksInDefaultBrowser'

// Preserver of the window size and position between app launches.
state.dimensions = windowStateKeeper('main', {
  width: 900,
  height: 1000
})

app.on('ready', function () {
    // set global to be accessible from webpage
    global.isNotificationSupported = isNotificationSupported()

    state.mainWindow = new BrowserWindow(state.dimensions)
    state.mainWindow.on('close', close)

    state.mainWindow.on('hide', function() {
      state.mainWindow.blurWebView()
    })

    if (state.dimensions.isMaximized) {
      state.mainWindow.maximize()
    }

    if (env.name === 'test') {
      state.mainWindow.loadURL('file://' + __dirname + '/spec.html')
    } else {
      state.mainWindow.loadURL(env.host)
    }

    if (env.name !== 'production') state.mainWindow.openDevTools()

    const Menu = state.Menu = require('menu')
    Menu.setApplicationMenu(Menu.buildFromTemplate(menu.main))

    initTray()
    setOpenLinksInDefaultBrowser()
})

app.on('window-all-closed', function () {})
app.on('before-quit', function () {
  state.dontPreventClose = true
})

app.on('certificate-error', function(e, webContents, url, error, certificate, callback) {
    if (url.indexOf('uebergrape.staging.chatgrape.com') > -1) {
      e.preventDefault()
      callback(true)
    } else {
      callback(false)
    }
})

app.on('platform-theme-changed', function () {
  if (!isOSX()) return
  let icon = paths[app.isDarkMode() ? 'trayWhiteIcon' : 'trayIcon']
  state.trayIcon.setImage(icon)
})

ipcMain.on('addBadge', function(e, badge) {
  if (isWindows()) {
    state.mainWindow.setOverlayIcon(
      statusBarOverlay,
      (badge + ' unread channel' + (parseInt(badge) > 1 ? 's' : ''))
    )
  } else {
    state.trayIcon.setImage(paths.trayBlueIcon)
    if (app.dock) app.dock.setBadge(String(badge))
  }
})

ipcMain.on('removeBadge', function() {
  const {trayIcon, mainWindow} = state
  if (isWindows()) {
    mainWindow.setOverlayIcon(nativeImage.createEmpty(), '')
  } else {
    let icon = paths[app.isDarkMode() ? 'trayWhiteIcon' : 'trayIcon']
    trayIcon.setImage(icon)
    if (app.dock) app.dock.setBadge('')
  }
})

ipcMain.on('showNotification', function(e, notification) {
  const {trayIcon} = state
  trayIcon.displayBalloon({
    icon: paths.icon,
    title: notification.title,
    content: notification.message
  })
  trayIcon.once('click', function() {
    e.sender.send(String(notification.event))
  })
})
