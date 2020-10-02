// eslint-disable-next-line import/no-extraneous-dependencies
import { shell, BrowserWindow } from 'electron'
import path from 'path'

import { images, blobs } from '../constants'
import { matchOne } from '../utils'

export const openWindow = url => {
  const secondaryWindowConfig = {
    width: 1200,
    height: 800,
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
