// eslint-disable-next-line import/no-extraneous-dependencies
import { Tray, systemPreferences } from 'electron'
import showMainWindow from './menu/actions/showMainWindow'
import state from './state'
import { osType } from './utils'
import * as imagePaths from '../constants/images'

export default function() {
  const { Menu } = state

  switch (osType()) {
    case 'win':
      state.trayIcon = new Tray(imagePaths.trayWindowsIcon)
      break
    case 'osx': {
      const icon =
        imagePaths[
          systemPreferences.isDarkMode() ? 'trayWhiteIcon' : 'trayIcon'
        ]
      state.trayIcon = new Tray(icon)
      state.trayIcon.setPressedImage(imagePaths.trayWhiteIcon)
      break
    }
    default:
      state.trayIcon = new Tray(imagePaths.trayIcon)
  }

  // eslint-disable-next-line global-require
  const menu = require('./menu')

  state.trayIcon.setToolTip('Grape')
  state.trayIcon.setContextMenu(Menu.buildFromTemplate(menu.tray))
  state.trayIcon.on('click', showMainWindow)
  state.trayIcon.on('balloon-click', showMainWindow)
}
