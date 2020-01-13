// eslint-disable-next-line import/no-extraneous-dependencies
import { app, nativeImage, nativeTheme } from 'electron'

import state from '../state'
import { getOsType } from '../utils'
import { images } from '../constants'

const { trayIcon, trayWhiteIcon, trayWhiteWindowsIcon } = images

export default () => {
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
}
