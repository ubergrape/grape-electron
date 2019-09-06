// eslint-disable-next-line import/no-extraneous-dependencies
import { shell, BrowserWindow } from 'electron'
import minimatch from 'minimatch'
import path from 'path'

import state from '../state'

const mainWindowLinks = [
  'file://**',
  '**/accounts/organization/dashboard*',
  '**/chat',
  '**/chat/**',
  '**/accounts/**',
  '**/accounts.google.com/**',
  '**/github.com/login**',
]

const shouldOpenIn = (globs, url) => globs.some(glob => minimatch(url, glob))

export default (e, url) => {
  if (shouldOpenIn(mainWindowLinks, url)) return

  e.preventDefault()

  if (minimatch(url, '**/call/*')) {
    const secondaryWindow = new BrowserWindow({
      width: 800,
      height: 600,
      parent: state.mainWindow,
      webPreferences: {
        preload: path.join(__dirname, '../preload/secondaryWindow.js'),
      },
    })

    secondaryWindow.loadURL(url)

    state.secondaryWindow = secondaryWindow
    return
  }

  shell.openExternal(url)
}
