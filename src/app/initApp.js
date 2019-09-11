// eslint-disable-next-line import/no-extraneous-dependencies
import { app, Menu, Tray } from 'electron'
import { autoUpdater } from 'electron-updater'

import state from '../state'
import loadApp from './loadApp'
import getOsType from '../utils/getOsType'
import isDevelopment from '../utils/isDevelopment'
import images from '../constants/images'
import { menu, tray } from '../menu'

const { trayWhiteIcon, trayWhiteWindowsIcon } = images

export default url => {
  autoUpdater.checkForUpdatesAndNotify()

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
