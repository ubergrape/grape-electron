// eslint-disable-next-line import/no-extraneous-dependencies
import { shell, BrowserWindow } from 'electron'
import minimatch from 'minimatch'
import path from 'path'

import ensureFocus from './ensureFocus'
import state from '../state'
import { images, blobs } from '../constants'
import { matchOne } from '../utils'

export const openWindow = url => {
  if (state.secondaryWindow) {
    const { secondaryWindow } = state
    ensureFocus(secondaryWindow)
    secondaryWindow.loadURL(url)
    return
  }

  const secondaryWindowConfig = {
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: false,
      contextIsolation: false,
    },
    icon: images.icon,
  }

  if (minimatch(url, blobs.secondaryWindowBlobs)) {
    secondaryWindowConfig.webPreferences.preload = path.join(
      __dirname,
      './preload/secondaryWindow.js',
    )
  }

  const secondaryWindow = new BrowserWindow(secondaryWindowConfig)
  secondaryWindow.once('closed', () => {
    state.secondaryWindow = null
  })
  secondaryWindow.loadURL(url)
}

export default (e, url) => {
  e.preventDefault()

  if (matchOne(blobs.mainWindowBlobs, url)) return

  if (matchOne(blobs.secondaryWindowBlobs, url)) {
    openWindow(url)
    return
  }

  shell.openExternal(url)
}
