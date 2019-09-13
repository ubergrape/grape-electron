import { app, ipcMain, Menu, Tray } from 'electron'
import { autoUpdater } from 'electron-updater'

import state from '../state'
import loadApp from './loadApp'
import { getOsType, getUrl, isDevelopment } from '../utils'
import { images } from '../constants'
import { menu, tray } from '../menu'
import store from '../store'
import env from '../env'

const { trayWhiteIcon, trayWhiteWindowsIcon } = images

export default url => {
  autoUpdater.checkForUpdatesAndNotify()

  global.host = store.get('host') || env.host

  loadApp(url)

  Menu.setApplicationMenu(Menu.buildFromTemplate(menu))

  switch (getOsType) {
    case 'windows':
      state.tray = new Tray(trayWhiteWindowsIcon)
      break
    case 'mac':
      state.tray = new Tray(trayWhiteIcon)
      state.tray.setPressedImage(trayWhiteIcon)
      break
    default:
      state.tray = new Tray(trayWhiteIcon)
  }

  state.tray.setToolTip(app.getName())
  state.tray.setContextMenu(Menu.buildFromTemplate(tray))

  if (isDevelopment) state.mainWindow.webContents.openDevTools()
}

ipcMain.on('domainChange', (e, { type, domain }) => {
  const isOnPremises = type === 'onPremises'
  if (isOnPremises) store.set('host.onPremisesDomain', domain)

  const url = getUrl({
    protocol: store.get('host.protocol'),
    domain: isOnPremises
      ? store.get('host.onPremisesDomain')
      : store.get('host.cloudDomain'),
    path: store.get('host.path'),
  })

  loadApp(url)
})
