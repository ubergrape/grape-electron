// eslint-disable-next-line import/no-extraneous-dependencies
import { shell, BrowserWindow } from 'electron'
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
    width: 1200,
    height: 800,
    webPreferences: {
      enableRemoteModule: false,
      contextIsolation: false,
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
  state.secondaryWindow = secondaryWindow

  secondaryWindow.once('closed', () => {
    state.secondaryWindow = null
  })
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
