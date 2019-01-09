// eslint-disable-next-line import/no-extraneous-dependencies
import { shell, BrowserWindow } from 'electron'
import minimatch from 'minimatch'

import state from './state'
import ensureFocus from './ensureFocus'

const mainWindowBlobs = [
  '**/accounts/organization/dashboard*',
  '**/chat',
  '**/chat/**',
  '**/accounts/tokenauth*',
  '**/accounts/logout*',
  '**/accounts/login*',
  '**/accounts.google.com/**',
  '**/github.com/login**',
]

const secondaryWindowBlobs = [
  '**/accounts/organization/settings*',
  '**/accounts/settings*',
  '**/accounts/organization/settings/members*',
  '**/accounts/settings*',
  '**/accounts/settings/notifications*',
]

let secondaryWindow

function openWindow(url) {
  if (secondaryWindow) {
    ensureFocus(secondaryWindow)
    secondaryWindow.loadURL(url)
    return
  }

  secondaryWindow = new BrowserWindow({
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
  })
  secondaryWindow.once('closed', () => {
    secondaryWindow = null
  })
  secondaryWindow.loadURL(url)
}

function handle(e, url) {
  const shouldOpenIn = globs => globs.some(glob => minimatch(url, glob))

  // We need to open that link in the same window - do nothing.
  if (shouldOpenIn(mainWindowBlobs)) return

  e.preventDefault()

  if (shouldOpenIn(secondaryWindowBlobs)) {
    openWindow(url)
    return
  }

  // Standard browser.
  shell.openExternal(url)
}

export default () => {
  const { webContents } = state.mainWindow
  webContents.on('new-window', handle)
  webContents.on('will-navigate', handle)
}
