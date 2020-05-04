import path, { normalize } from 'path'

export const assets = normalize(`${__dirname}/../../build`)

const trayIcons = path.join(assets, 'tray-icons')

export default {
  logo: path.join(assets, 'logo.svg'),
  icon: path.join(assets, 'icon.png'),
  trayIcon: path.join(trayIcons, 'tray.png'),
  trayWhiteIcon: path.join(trayIcons, 'tray-white.png'),
  trayBlueIcon: path.join(trayIcons, 'tray-blue.png'),
  trayWhiteWindowsIcon: path.join(trayIcons, 'tray-white-windows.png'),
  trayBlueWindowsIcon: path.join(trayIcons, 'tray-blue-windows.png'),
  overlayIcon: path.join(assets, 'overlay.png'),
}
