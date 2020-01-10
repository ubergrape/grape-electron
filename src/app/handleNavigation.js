// eslint-disable-next-line import/no-extraneous-dependencies
import { shell, BrowserWindow } from 'electron'
import minimatch from 'minimatch'
import path from 'path'

import ensureFocus from './ensureFocus'
import state from '../state'
import { images } from '../constants'

const mainWindowBlobs = [
  'file://**',
  '**/accounts/organization/dashboard*',
  '**/chat',
  '**/chat/**',
  '**/accounts/**',
  '**/accounts.google.com/**',
  '**/github.com/login**',
]

const secondaryWindowBlobs = ['**/call/*']

export const openWindow = url => {
  if (state.secondaryWindow) {
    const { secondaryWindow } = state
    ensureFocus(secondaryWindow)
    secondaryWindow.loadURL(url)
    return
  }

  const secondaryWindowConfig = {
    webPreferences: {
      nodeIntegration: url.startsWith('file:'),
      enableRemoteModule: url.startsWith('file:'),
      nodeIntegrationInWorker: url.startsWith('file:'),
      contextIsolation: false,
    },
    icon: images.icon,
  }

  if (minimatch(url, '**/call/*')) {
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

const shouldOpenIn = (globs, url) => globs.some(glob => minimatch(url, glob))

export default (e, url) => {
  if (shouldOpenIn(mainWindowBlobs, url)) return

  e.preventDefault()

  if (shouldOpenIn(secondaryWindowBlobs, url)) {
    openWindow(url)
    return
  }

  shell.openExternal(url)
}
