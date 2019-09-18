// eslint-disable-next-line import/no-extraneous-dependencies
import { app, ipcMain, Menu, Tray } from 'electron'
import { autoUpdater } from 'electron-updater'

import state from '../state'
import loadApp from './loadApp'
import loadURL from './loadUrl'

import { getOsType, getUrl } from '../utils'
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
}

ipcMain.on('domainChange', (e, { type, domain }) => {
  store.set('host.type', type)
  if (type === 'onPremises') store.set('host.onPremisesDomain', domain)

  loadApp(getUrl())
})

ipcMain.on('loadChat', () => {
  loadURL(getUrl(), state.mainWindow)
})
