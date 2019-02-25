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
  '**/call/jitsire/*',
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
  // https://github.com/jitsi/jitsi-meet-electron-utils/blob/master/screensharing/index.js
  if (minimatch(url, '**/call/jitsire/*')) {
    secondaryWindow.webContents.on('dom-ready', () => {
      secondaryWindow.webContents.executeJavaScript(`
        const electron = require('electron')
        window.JitsiMeetElectron = {
          /**
           * Get sources available for screensharing. The callback is invoked
           * with an array of DesktopCapturerSources.
           *
           * @param {Function} callback - The success callback.
           * @param {Function} errorCallback - The callback for errors.
           * @param {Object} options - Configuration for getting sources.
           * @param {Array} options.types - Specify the desktop source types
           * to get, with valid sources being "window" and "screen".
           * @param {Object} options.thumbnailSize - Specify how big the
           * preview images for the sources should be. The valid keys are
           * height and width, e.g. { height: number, width: number}. By
           * default electron will return images with height and width of
           * 150px.
           */
          obtainDesktopStreams(callback, errorCallback, options = {}) {
            electron.desktopCapturer.getSources(options, (error, sources) => {
              if (error) {
                errorCallback(error)
                return
              }

              callback(sources)
            })
          },
        }
      `)
    })
  }
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
