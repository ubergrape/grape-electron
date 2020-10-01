// eslint-disable-next-line import/no-extraneous-dependencies
import { shell, BrowserWindow } from 'electron'
import windowStateKeeper from 'electron-window-state'
import path from 'path'

import { images, blobs } from '../constants'
import { matchOne } from '../utils'

export const openWindow = url => {
  const secondaryWindowState = windowStateKeeper({
    defaultWidth: 1200,
    defaultHeight: 800,
    file: 'secondary-window-state.json',
  })

  const secondaryWindowConfig = {
    width: secondaryWindowState.width,
    height: secondaryWindowState.height,
    x: secondaryWindowState.x,
    y: secondaryWindowState.y,
    webPreferences: {
      contextIsolation: false,
      partition: 'persist:webview',
    },
    icon: images.icon,
  }

  if (matchOne(url, blobs.secondaryWindowBlobs)) {
    secondaryWindowConfig.webPreferences.preload = path.join(
      __dirname,
      './preload/secondaryWindow.js',
    )
  }

  const secondaryWindow = new BrowserWindow(secondaryWindowConfig)

  secondaryWindowState.manage(secondaryWindow)

  secondaryWindow.loadURL(url)
}

export default (url, e) => {
  if (e) e.preventDefault()

  if (matchOne(url, blobs.mainWindowBlobs)) return

  if (matchOne(url, blobs.secondaryWindowBlobs)) {
    openWindow(url)
    return
  }

  shell.openExternal(url)
}
