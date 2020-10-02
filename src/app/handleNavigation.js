// eslint-disable-next-line import/no-extraneous-dependencies
import { shell, BrowserWindow } from 'electron'
import compareVersions from 'compare-versions'
import windowStateKeeper from 'electron-window-state'
import url from 'url'
import path from 'path'

import { images, blobs } from '../constants'
import state from '../state'
import { matchOne } from '../utils'

export const openWindow = _url => {
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

  if (compareVersions.compare(state.webClientVersion, '2.15.8', '>')) {
    let isCallWindowExist = false

    BrowserWindow.getAllWindows().forEach(win => {
      const winUrl = win.webContents.getURL()

      if (matchOne(winUrl, blobs.secondaryWindowBlobs)) {
        const urlPathName = url.parse(_url).pathname.split('/')[2]
        const winPathName = url.parse(winUrl).pathname.split('/')[2]

        if (urlPathName === winPathName) {
          isCallWindowExist = true
          win.show()
          if (!state.isCallOngoing) {
            win.loadURL(_url)
          }
        }
      }
    })

    if (isCallWindowExist) return
  }

  if (matchOne(_url, blobs.secondaryWindowBlobs)) {
    secondaryWindowConfig.webPreferences.preload = path.join(
      __dirname,
      './preload/secondaryWindow.js',
    )
  }

  const secondaryWindow = new BrowserWindow(secondaryWindowConfig)

  secondaryWindowState.manage(secondaryWindow)

  secondaryWindow.loadURL(_url)
}

export default (_url, e) => {
  if (e) e.preventDefault()

  if (matchOne(_url, blobs.mainWindowBlobs)) return

  if (matchOne(_url, blobs.secondaryWindowBlobs)) {
    openWindow(_url)
    return
  }

  shell.openExternal(_url)
}
