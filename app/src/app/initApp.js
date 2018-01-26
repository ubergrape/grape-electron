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

import {formatMessage} from '../i18n'
import {
  isNotificationSupported,
  isWindows,
  isOSX
} from './utils'
import env from './env'
import state from './state'
import windowStateKeeper from 'electron-window-state'
import * as menu from './menu'
import loadApp from './loadApp'
import loadURL from './loadURL'
import {urls} from '../constants/pages'
import * as imagePaths from '../constants/images'
import {handle as handleProtocol} from './protocolHandler'

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

export default () => {
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
  state.dimensions = windowStateKeeper({
    defaultWidth: 1075,
    defaultHeight: 1000
  })


  // figure out if we start in background
  const autostart = process.argv.indexOf('--autostart') !== -1
  const startInBackground = autostart && env.startInBackgroundWhenAutostarted
  console.log(`autostart: ${autostart}`)
  console.log(`startInBackground: ${startInBackground}`)

  storage.get('lastUrl', (err, data) => {
    state.prefs = Object.assign(
      {},
      state.dimensions,
      {
        webPreferences: {
          allowDisplayingInsecureContent: true
        },
        show: !startInBackground
      }
    )

    // set global to be accessible from webpage
    global.isNotificationSupported = isNotificationSupported()
    global.host = state.host
    global.grapeHost = env.host
    global.chooseDomainDisabled = env.chooseDomainDisabled

    state.mainWindow = new BrowserWindow(state.prefs)
    if (state.dimensions.isMaximized && state.prefs.show) {
      state.mainWindow.maximize()
    } else {
      console.log('start in background')
      state.mainWindow.hide()
    }

    const Menu = state.Menu = require('electron').Menu
    Menu.setApplicationMenu(Menu.buildFromTemplate(menu.main))

    const isProtocolHandled = handleProtocol()

    if (isProtocolHandled) return

    let lastUrl

    if (data) {
      // use host from storage only if env.chooseDomainDisabled is false
      // otherwise it overrides the one from graperc
      if (!env.chooseDomainDisabled && data.host) {
        global.host = state.host = data.host
      }
      if (data.url) lastUrl = data.url
    }

    if (lastUrl) {
      loadApp(lastUrl)
    } else if (env.chooseDomainDisabled) {
      loadApp()
    } else {
      loadApp(urls[env.name === 'test' ? 'test' : 'domain'])
    }
  })

  app.on('window-all-closed', () => {})
  app.on('before-quit', () => {
    state.preventClose = false
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
    const {trayIcon, mainWindow} = state
    trayIcon.displayBalloon({
      icon: imagePaths.icon,
      title: notification.title,
      content: notification.message
    })
    trayIcon.once('balloon-click', () => {
      e.sender.send(String(notification.event))
    })

    mainWindow.once('focus', () => {
      mainWindow.flashFrame(false)
    })
    mainWindow.flashFrame(true)
  })

  ipcMain.on('domainChange', (e, domain) => {
    state.host.domain = domain
    global.host.domain = domain
    loadApp()
  })

  ipcMain.on('loadChat', () => {
    loadURL(state.getUrl())
  })
}
