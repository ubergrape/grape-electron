import path from 'path'
import { assets } from './paths'

const trayIcons = path.join(assets, 'tray-icons')

export default {
  logo: path.join(assets, 'logo.png'),
  icon: path.join(assets, 'icon.png'),
  trayWhiteIcon: path.join(trayIcons, 'tray-white.png'),
  trayWhiteWindowsIcon: path.join(trayIcons, 'tray-white-windows.png'),
}
