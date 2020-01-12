// eslint-disable-next-line import/no-extraneous-dependencies
import { app } from 'electron'
import electronReload from 'electron-reload'
import path from 'path'
import log from 'electron-log'
import { autoUpdater } from 'electron-updater'

import initApp from './app/initApp'
import { register, unregister } from './app/shortcuts'
import { pages } from './constants'
import state from './state'
import store from './store'
import { isDevelopment, getOsType, getPageParams, getUrlToLoad } from './utils'
import pkg from '../package.json'

autoUpdater.logger = log
autoUpdater.logger.transports.file.level = 'debug'

app.allowRendererProcessReuse = true

const init = () => {
  if (isDevelopment) {
    electronReload(__dirname, {
      electron: path.join(__dirname, '../node_modules/.bin/electron'),
    })
  }

  app.on('ready', () => {
    if (getOsType === 'windows') {
      // https://electronjs.org/docs/tutorial/notifications#windows
      if (isDevelopment) app.setAppUserModelId(process.execPath)
      else app.setAppUserModelId(pkg.appId)
    }

    const url = getUrlToLoad(store)
    const { searchParams, protocol } = new URL(url)
    const page = searchParams.get('page')

    if (page === 'connectionError' && protocol === 'file:') {
      initApp(pages.domain)
      return
    }

    initApp(url)
  })

  app.on('browser-window-focus', () => {
    register()
  })

  app.on('browser-window-blur', () => {
    unregister()
  })

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
  })

  app.on('before-quit', () => {
    unregister()
    const currentUrl = state.mainWindow.webContents.getURL()

    const { page, url } = getPageParams(currentUrl)
    if (page === 'chat') {
      store.set('lastUrl', url)
    } else {
      store.set('lastUrl', currentUrl)
    }

    app.quitting = true
  })

  app.on('activate', () => {
    state.mainWindow.show()
  })

  autoUpdater.on('error', err => {
    log.error(err)
  })
}

const getPreloadScriptPath = name =>
  `file://${path.join(__dirname, `./app/preload/${name}.js`)}`

app.on('web-contents-created', (event, contents) => {
  contents.on('will-attach-webview', (e, webPreferences) => {
    const { preloadURL } = webPreferences
    const mainWindowPath = getPreloadScriptPath('mainWindow')
    const secondaryWindowPath = getPreloadScriptPath('mainWindow')

    if (preloadURL !== mainWindowPath && preloadURL !== secondaryWindowPath) {
      e.preventDefault()
    }

    // Disable Node.js integration
    // eslint-disable-next-line no-param-reassign
    webPreferences.nodeIntegration = false
  })
})

const gotTheLock = app.requestSingleInstanceLock()

if (!gotTheLock) {
  app.quit()
} else {
  app.on('second-instance', () => {
    if (state.mainWindow) {
      if (state.mainWindow.isMinimized()) state.mainWindow.restore()
      state.mainWindow.focus()
    }
  })

  init()
}
