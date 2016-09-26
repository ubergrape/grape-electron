// This is main process of Electron, started as first thing when your
// app starts. This script is running through entire life of your application.
// It doesn't have any windows which you can see on screen, but we can open
// window from here.
import {
  app,
  BrowserWindow,
  ipcMain,
  nativeImage,
  systemPreferences
} from 'electron'
import storage from 'electron-json-storage'
import contextMenu from 'electron-context-menu'
import clone from 'lodash.clone'
import {defineMessages} from 'react-intl'

import {
  isNotificationSupported,
  isWindows,
  isOSX
} from './utils'
// Special module holding environment variables which you declared
// in config/env_xxx.json file.
import env from './env'
import state from './state'
import windowStateKeeper from '../electron/windowStateKeeper'
import * as menu from './menu'
import loadApp from './loadApp'
import loadURL from './loadURL'
import {urls} from '../constants/pages'
import * as imagePaths from '../constants/images'
import {formatMessage} from '../i18n'

const messages = defineMessages({
  saveImageTo: {
    id: 'saveImageTo',
    defaultMessage: 'Save Image to…'
  },
  windowsBadgeIconTitle: {
    id: 'windowsBadgeIconTitle',
    defaultMessage: '{amount} unread {amount, plural, one {channel} other {channels}}'
  }
})

contextMenu({
  append: params => [{
    label: formatMessage(messages.saveImageTo),
    visible: params.mediaType === 'image',
    click: () => {
      state.mainWindow.webContents.downloadURL(params.srcURL)
    }
  }]
})

// Preserver of the window size and position between app launches.
state.dimensions = windowStateKeeper('main', {
  width: 1075,
  height: 1000
})

app.on('ready', () => {
  storage.get('lastUrl', (error, data) => {
    state.prefs = Object.assign(
      {},
      state.dimensions,
      {
        webPreferences: {
          allowDisplayingInsecureContent: true
        }
      }
    )

    // set global to be accessible from webpage
    global.isNotificationSupported = isNotificationSupported()
    global.host = state.host
    global.grapeHost = env.host

    state.mainWindow = new BrowserWindow(state.prefs)

    let lastUrl
    if (!error && data) {
      if (data.host) {
        global.host = state.host = data.host
      }
      if (data.url && data.url.includes(state.host.domain)) lastUrl = data.url
    }
    if (lastUrl) {
      loadApp(lastUrl)
    } else {
      global.host = clone(env.host)
      state.mainWindow.loadURL(urls[env.name === 'test' ? 'test' : 'domain'])
    }

    if (state.dimensions.isMaximized) {
      state.mainWindow.maximize()
    }

    const Menu = state.Menu = require('electron').Menu
    Menu.setApplicationMenu(Menu.buildFromTemplate(menu.main))
  })
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
    const icon = imagePaths[systemPreferences.isDarkMode() ? 'trayWhiteIcon' : 'trayIcon']
    state.trayIcon.setImage(icon)
  })
}

ipcMain.on('addBadge', (e, badge) => {
  if (isWindows()) {
    state.mainWindow.setOverlayIcon(
      imagePaths.statusBarOverlay,
      formatMessage(
        messages.windowsBadgeIconTitle,
        {amount: parseInt(badge, 10)}
      )
    )
  } else {
    state.trayIcon.setImage(imagePaths.trayBlueIcon)
    if (app.dock) app.dock.setBadge(String(badge))
  }
})

ipcMain.on('removeBadge', () => {
  const {trayIcon, mainWindow} = state
  if (isWindows()) {
    mainWindow.setOverlayIcon(nativeImage.createEmpty(), '')
  }

  if (isOSX()) {
    const icon = imagePaths[systemPreferences.isDarkMode() ? 'trayWhiteIcon' : 'trayIcon']
    trayIcon.setImage(icon)
    if (app.dock) app.dock.setBadge('')
  }
})

ipcMain.on('showNotification', (e, notification) => {
  const {trayIcon} = state
  trayIcon.displayBalloon({
    icon: imagePaths.icon,
    title: notification.title,
    content: notification.message
  })
  trayIcon.once('balloon-click', () => {
    e.sender.send(String(notification.event))
  })
})

ipcMain.on('domain', (e, domain) => {
  state.host.domain = domain
  global.host.domain = domain
  loadApp()
})

ipcMain.on('loadChat', () => {
  loadURL(state.getUrl())
})
