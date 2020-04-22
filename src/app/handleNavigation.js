// eslint-disable-next-line import/no-extraneous-dependencies
import { shell, BrowserWindow } from 'electron'

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
      nodeIntegration: true,
      partition: 'persist:webview',
    },
    icon: images.icon,
  }

  const secondaryWindow = new BrowserWindow(secondaryWindowConfig)
  secondaryWindow.removeMenu()
  state.secondaryWindow = secondaryWindow

  // https://github.com/jitsi/jitsi-meet-electron-utils/blob/master/screensharing/index.js
  if (matchOne(url, blobs.secondaryWindowBlobs)) {
    secondaryWindow.webContents.on('dom-ready', () => {
      secondaryWindow.webContents.executeJavaScript(`	
        const { desktopCapturer } = require('electron')

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
            desktopCapturer.getSources(options).then((sources, error) => {
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
