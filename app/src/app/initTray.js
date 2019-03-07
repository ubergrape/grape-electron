import { Tray, systemPreferences } from 'electron'
import showMainWindow from './tabs/actions/showMainWindow'
import state from './state'
import { osType } from './utils'
import * as imagePaths from '../constants/images'
import * as menu from './tabs'

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

  state.trayIcon.setToolTip('Grape')
  state.trayIcon.setContextMenu(Menu.buildFromTemplate(menu.tray))
  state.trayIcon.on('click', showMainWindow)
  state.trayIcon.on('balloon-click', showMainWindow)
}
