// eslint-disable-next-line import/no-extraneous-dependencies
import {
  app,
  ipcMain,
  Menu,
  Tray,
  systemPreferences,
  nativeImage,
} from 'electron'
import { autoUpdater } from 'electron-updater'
import log from 'electron-log'

import state from '../state'
import loadApp from './loadApp'
import loadURL from './loadUrl'

import { getOsType, getChatUrl } from '../utils'
import { images } from '../constants'
import { getMenuTemplate, trayTemplate } from '../menu'
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

export default url => {
  autoUpdater.checkForUpdatesAndNotify()

  global.store = store.get() || env

  loadApp(url)

  Menu.setApplicationMenu(Menu.buildFromTemplate(getMenuTemplate()))

  switch (getOsType) {
    case 'windows':
      state.tray = new Tray(trayWhiteWindowsIcon)
      break
    case 'mac':
      state.tray = new Tray(
        systemPreferences.isDarkMode() ? trayWhiteIcon : trayIcon,
      )
      state.tray.setPressedImage(
        systemPreferences.isDarkMode() ? trayWhiteIcon : trayIcon,
      )
      break
    default:
      state.tray = new Tray(trayWhiteIcon)
  }

  state.tray.setToolTip(app.getName())
  state.tray.setContextMenu(Menu.buildFromTemplate(trayTemplate))
}

ipcMain.on('addBadge', (e, badge) => {
  const { tray, mainWindow } = state
  switch (getOsType) {
    case 'windows':
      tray.setImage(trayBlueWindowsIcon)
      mainWindow.setOverlayIcon(
        overlayIcon,
        `${parseInt(badge, 10)} unread channels`,
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
      tray.setImage(systemPreferences.isDarkMode() ? trayWhiteIcon : trayIcon)
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
