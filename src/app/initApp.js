// eslint-disable-next-line import/no-extraneous-dependencies
import { app, ipcMain, Menu, Tray } from 'electron'
import { autoUpdater } from 'electron-updater'

import state from '../state'
import loadApp from './loadApp'
import loadURL from './loadUrl'

import { getOsType, getChatUrl } from '../utils'
import { images } from '../constants'
import { getMenuTemplate, tray } from '../menu'
import store from '../store'
import env from '../env'

const { trayWhiteIcon, trayWhiteWindowsIcon } = images

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
      state.tray = new Tray(trayWhiteIcon)
      state.tray.setPressedImage(trayWhiteIcon)
      break
    default:
      state.tray = new Tray(trayWhiteIcon)
  }

  state.tray.setToolTip(app.getName())
  state.tray.setContextMenu(Menu.buildFromTemplate(tray))
}

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
