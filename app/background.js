// This is main process of Electron, started as first thing when your
// app starts. This script is running through entire life of your application.
// It doesn't have any windows which you can see on screen, but we can open
// window from here.
import os from 'os'

import {
  isNotificationSupported,
  isWindows,
  isOSX
} from './utils'

import {
  app,
  BrowserWindow,
  ipcMain,
  Tray,
  nativeImage
} from 'electron'

import devHelper from './vendor/electron_boilerplate/dev_helper'
import windowStateKeeper from './vendor/electron_boilerplate/window_state'
import path from 'path'
import storage from 'electron-json-storage'

// Special module holding environment variables which you declared
// in config/env_xxx.json file.
import env from './env'

var Menu = require('menu')

var mainWindow
var trayIcon
var balloonClickHandler

// Preserver of the window size and position between app launches.
var mainWindowState = windowStateKeeper('main', {
    width: 900,
    height: 1000
})

var dontPreventClose = false

app.on('ready', function () {

    mainWindow = new BrowserWindow({
        x: mainWindowState.x,
        y: mainWindowState.y,
        width: mainWindowState.width,
        height: mainWindowState.height,
    })

    mainWindow.on('close', function(e) {
      if (!dontPreventClose) {
        e.preventDefault()

        if (isWindows()) {
          mainWindow.setSkipTaskbar(true)
          mainWindow.hide()

          storage.has('closeBalloonShown', function(e, hasKey) {
            if (eZ) throw eZ;

            if (!hasKey) {
              trayIcon.displayBalloon({
                icon: path.join(__dirname, 'images/icon.png'),
                title: 'Notifications for Grape',
                content: 'You\'ll see notifications for new private messages and mentions here.'
              })

              storage.set('closeBalloonShown', {shown: true}, function(e) { if (e) throw(e) })
            }
          })
        }
        if (isOSX()) app.hide()
      }
      mainWindowState.saveState(mainWindow)
    })

    mainWindow.on('hide', function() {
      mainWindow.blurWebView()
    })

    global.isNotificationSupported = isNotificationSupported()

    if (mainWindowState.isMaximized) {
        mainWindow.maximize()
    }

    if (env.name === 'test') {
        mainWindow.loadURL('file://' + __dirname + '/spec.html')
    } else {
        mainWindow.loadURL('file://' + __dirname + '/app.html')
    }

    if (env.name !== 'production') {
        devHelper.setDevMenu()
        mainWindow.openDevTools()
    }

    var mainMenu = [{
        label: "Application",
        submenu: [
            { label: "About Grape", selector: "orderFrontStandardAboutPanel:" },
            { type: "separator" },
            { label: "Quit", accelerator: "Command+Q", click: function() {
                dontPreventClose = true
                app.quit()
              }
            }
        ]}, {
        label: "Edit",
        submenu: [
            { label: "Undo", accelerator: "CmdOrCtrl+Z", selector: "undo:" },
            { label: "Redo", accelerator: "Shift+CmdOrCtrl+Z", selector: "redo:" },
            { type: "separator" },
            { label: "Cut", accelerator: "CmdOrCtrl+X", selector: "cut:" },
            { label: "Copy", accelerator: "CmdOrCtrl+C", selector: "copy:" },
            { label: "Paste", accelerator: "CmdOrCtrl+V", selector: "paste:" },
            { label: "Select All", accelerator: "CmdOrCtrl+A", selector: "selectAll:" }
        ]}
    ]

    Menu.setApplicationMenu(Menu.buildFromTemplate(mainMenu))

    var trayMenu = Menu.buildFromTemplate([
      { label: "Open", click: function() {
          mainWindow.show()
          mainWindow.focus()
        }
      },
      { label: "Quit", click: function() {
          dontPreventClose = true
          app.quit()
        }
      }
    ])

    if (isWindows()) {
      trayIcon = new Tray(path.join(__dirname, 'images/tray-windows.png'))
    } else if (isOSX()) {
      trayIcon = new Tray(
        path.join(
          __dirname,
          'images/tray' + (app.isDarkMode() ? '-white.png' : '.png'))
      )
      trayIcon.setPressedImage(path.join(__dirname, 'images/tray-white.png'))
    } else {
      trayIcon = new Tray(path.join(__dirname, 'images/tray.png'))
    }

    trayIcon.setToolTip('Grape')
    trayIcon.setContextMenu(trayMenu)
    trayIcon.on('click', function() {
      if (isWindows()) mainWindow.setSkipTaskbar(false)
      mainWindow.show()
      mainWindow.focus()
    })
    trayIcon.on('balloon-click', function() {
      mainWindow.show()
      mainWindow.focus()
      balloonClickHandler()
    })
})

app.on('window-all-closed', function () {})
app.on('before-quit', function () {
  dontPreventClose = true
})

app.on('platform-theme-changed', function () {
  if (isOSX()) {
    trayIcon.setImage(
      path.join(
        __dirname,
        'images/tray' + (app.isDarkMode() ? '-white.png' : '.png'))
    )
  }
})

ipcMain.on('addBadge', function(e, badge) {
  if (isWindows()) {
    mainWindow.setOverlayIcon(
      path.join(__dirname, 'images/overlay.png'),
      (badge + ' unread channel' + parseInt(badge) > 1 ? 's' : '')
    )
  } else {
    trayIcon.setImage(path.join(__dirname, 'images/tray-blue.png'))
  }

  if (app.dock) app.dock.setBadge(String(badge))
})

ipcMain.on('removeBadge', function() {
  if (isWindows()) {
    mainWindow.setOverlayIcon(nativeImage.createEmpty(), '')
  } else if (isOSX()) {
    trayIcon.setImage(
      path.join(
        __dirname,
        'images/tray' + (app.isDarkMode() ? '-white.png' : '.png'))
    )
  }
  if (app.dock) app.dock.setBadge('')
})

ipcMain.on('showNotification', function(e, notification) {
  balloonClickHandler = function() {
    e.sender.send('notificationClicked', notification.slug)
  }
  trayIcon.displayBalloon({
    icon: path.join(__dirname, 'images/icon.png'),
    title: notification.title,
    content: notification.message
  })
})
