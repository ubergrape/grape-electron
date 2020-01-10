// eslint-disable-next-line import/no-extraneous-dependencies
import {
  app,
  ipcMain,
  Menu,
  Tray,
  systemPreferences,
  nativeImage,
  nativeTheme,
} from 'electron'
import { autoUpdater } from 'electron-updater'
import log from 'electron-log'
import contextMenu from 'electron-context-menu'

import state from '../state'
import loadApp from './loadApp'
import loadURL from './loadUrl'

import { getOsType, getChatUrl } from '../utils'
import { images } from '../constants'
import { getMenuTemplate, getTrayTemplate } from './menu'
import showMainWindow from './menu/actions/showMainWindow'
import store from '../store'
import env from '../env'

const {
  trayIcon,
  overlayIcon,
  trayBlueIcon,
  trayWhiteIcon,
  trayBlueWindowsIcon,
  trayWhiteWindowsIcon,
} = images

const messages = {
  saveImageTo: {
    id: 'saveImageTo',
    defaultMessage: 'Save Image to…',
  },
  windowsBadgeIconTitle: {
    id: 'windowsBadgeIconTitle',
    defaultMessage:
      '{amount} unread {amount, plural, one {channel} other {channels}}',
  },
}

export default url => {
  // eslint-disable-next-line global-require
  const { formatMessage } = require('../i18n')
  contextMenu({
    append: (defaultActions, params) => [
      {
        label: formatMessage(messages.saveImageTo),
        visible: params.mediaType === 'image',
        click: () => {
          state.mainWindow.webContents.downloadURL(params.srcURL)
        },
      },
    ],
  })

  autoUpdater.checkForUpdatesAndNotify()

  global.store = store.get() || env

  loadApp(url)

  Menu.setApplicationMenu(Menu.buildFromTemplate(getMenuTemplate()))

  switch (getOsType) {
    case 'windows':
      state.tray = new Tray(trayWhiteWindowsIcon)
      break
    case 'mac':
      // https://electronjs.org/docs/tutorial/mojave-dark-mode-guide#automatically-updating-your-own-interfaces
      systemPreferences.subscribeNotification(
        'AppleInterfaceThemeChangedNotification',
        () => {
          state.tray.setImage(
            nativeTheme.shouldUseDarkColors ? trayWhiteIcon : trayIcon,
          )
        },
      )

      state.tray = new Tray(
        nativeTheme.shouldUseDarkColors ? trayWhiteIcon : trayIcon,
      )
      state.tray.setPressedImage(
        nativeTheme.shouldUseDarkColors ? trayWhiteIcon : trayIcon,
      )
      break
    default:
      state.tray = new Tray(trayWhiteIcon)
  }

  state.tray.setToolTip(app.name)
  state.tray.setContextMenu(Menu.buildFromTemplate(getTrayTemplate()))
  state.tray.on('click', () => showMainWindow())
}

ipcMain.on('addBadge', (e, badge) => {
  const { tray, mainWindow } = state
  // eslint-disable-next-line global-require
  const { formatMessage } = require('../i18n')

  switch (getOsType) {
    case 'windows':
      tray.setImage(trayBlueWindowsIcon)
      mainWindow.setOverlayIcon(
        overlayIcon,
        formatMessage(messages.windowsBadgeIconTitle, {
          amount: parseInt(badge, 10),
        }),
      )
      break
    case 'mac':
      tray.setImage(trayBlueIcon)
      app.dock.setBadge(String(badge))
      break
    default:
      tray.setImage(trayBlueIcon)
      app.setBadgeCount(Number(badge))
      break
  }
})

ipcMain.on('removeBadge', () => {
  const { tray, mainWindow } = state
  switch (getOsType) {
    case 'windows':
      tray.setImage(trayWhiteWindowsIcon)
      mainWindow.setOverlayIcon(nativeImage.createEmpty(), '')
      break
    case 'mac':
      tray.setImage(nativeTheme.shouldUseDarkColors ? trayWhiteIcon : trayIcon)
      app.dock.setBadge('')
      break
    default:
      tray.setImage(trayWhiteIcon)
      app.setBadgeCount(0)
      break
  }
})

ipcMain.on('onConnectionEvent', (e, name, text) => {
  log.warn('on-connection-event', name, text || '')
})

ipcMain.on('domainChange', (e, { type, domain, protocol }) => {
  store.set('currentDomainType', type)
  if (type === 'onPremises') {
    store.set('host.onPremisesProtocol', protocol)
    store.set('host.onPremisesDomain', domain)
  }

  loadApp(getChatUrl())
})

ipcMain.on('loadChat', () => {
  loadURL(getChatUrl(), state.mainWindow)
})

ipcMain.on('showMainWindow', () => {
  state.mainWindow.show()
})

ipcMain.on('bounceIcon', () => {
  if (getOsType === 'mac') app.dock.bounce()
})
