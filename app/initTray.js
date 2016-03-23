import {app, Tray} from 'electron'
import state from './state'
import {isWindows, osType} from './utils'
import * as paths from './paths'
import * as menu from './menu'


function showMainWindow() {
  const {mainWindow} = state
  if (isWindows()) mainWindow.setSkipTaskbar(false)
  mainWindow.show()
  mainWindow.focus()
}

export default function() {
  const {Menu} = state

  switch (osType()) {
    case 'win':
      state.trayIcon = new Tray(paths.trayWindowsIcon)
      break
    case 'osx': {
      let icon = paths[app.isDarkMode() ? 'trayWhiteIcon' : 'trayIcon']
      state.trayIcon = new Tray(icon)
      state.trayIcon.setPressedImage(paths.trayWhiteIcon)
      break
    }
    default:
      state.trayIcon = new Tray(paths.trayIcon)
  }

  state.trayIcon.setToolTip('Grape')
  state.trayIcon.setContextMenu(Menu.buildFromTemplate(menu.tray))
  state.trayIcon.on('click', showMainWindow)
  state.trayIcon.on('balloon-click', showMainWindow)
}


