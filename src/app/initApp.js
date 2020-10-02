// eslint-disable-next-line import/no-extraneous-dependencies
import {
  app,
  session,
  screen,
  ipcMain,
  Menu,
  Tray,
  BrowserWindow,
  nativeTheme,
} from 'electron'
import log from 'electron-log'
import { white } from 'grape-theme/dist/base-colors'
import { registerListener } from 'grape-electron-dl'
import windowStateKeeper from 'electron-window-state'

import loadUrl from './loadUrl'
import handleNavigation from './handleNavigation'
import handleRedirect from './handleRedirect'
import { register as registerProtocol } from './protocolHandler'
import removeBadge from './removeBadge'
import autoUpdate from './autoUpdate'
import { getMenuTemplate, getTrayTemplate } from './menu'
import env from '../env'
import store from '../store'
import state from '../state'
import { images, isDevelopment, isMas, isWindowsStore } from '../constants'
import { getOsType, getChatUrl } from '../utils'
import showMainWindow from './menu/actions/showMainWindow'
import startUpdateTimer from './autoUpdate/startUpdateTimer'

const {
  trayIcon,
  overlayIcon,
  trayBlueIcon,
  trayWhiteIcon,
  trayBlueWindowsIcon,
  trayWhiteWindowsIcon,
} = images

const messages = {
  windowsBadgeIconTitle: {
    id: 'windowsBadgeIconTitle',
    defaultMessage:
      '{amount} unread {amount, plural, one {channel} other {channels}}',
  },
}

export default url => {
  if (getOsType !== 'linux' && !isMas && !isWindowsStore) autoUpdate()
  global.store = store.get() || env
  startUpdateTimer()

  if (state.mainWindow) state.mainWindow.close()
  else {
    state.isShown = false
    state.isInitialLoading = true
  }

  const { width, height } = screen.getPrimaryDisplay().workAreaSize

  const mainWindowState = windowStateKeeper({
    defaultWidth: width,
    defaultHeight: height,
    file: 'main-window-state.json',
  })

  const mainWindow = new BrowserWindow({
    minHeight: 600,
    minWidth: 800,
    width: mainWindowState.width,
    height: mainWindowState.height,
    x: mainWindowState.x,
    y: mainWindowState.y,
    show: Boolean(state.mainWindow) && state.isShown,
    backgroundColor: white,
    webPreferences: {
      webviewTag: true,
      nodeIntegration: true,
    },
  })

  mainWindowState.manage(mainWindow)

  state.mainWindow = mainWindow
  if (isDevelopment) mainWindow.webContents.openDevTools()

  loadUrl(url)

  Menu.setApplicationMenu(Menu.buildFromTemplate(getMenuTemplate()))

  switch (getOsType) {
    case 'windows':
      state.tray = new Tray(trayWhiteWindowsIcon)
      break
    case 'mac':
      // https://www.electronjs.org/docs/tutorial/mojave-dark-mode-guide#automatically-updating-your-own-interfaces
      nativeTheme.on('updated', () => {
        state.tray.setImage(
          nativeTheme.shouldUseDarkColors ? trayWhiteIcon : trayIcon,
        )
      })

      state.tray = new Tray(
        nativeTheme.shouldUseDarkColors ? trayWhiteIcon : trayIcon,
      )
      state.tray.setPressedImage(
        nativeTheme.shouldUseDarkColors ? trayWhiteIcon : trayIcon,
      )
      break
    default:
      state.tray = new Tray(trayWhiteIcon)
  }

  state.tray.setToolTip(app.name)
  state.tray.setContextMenu(Menu.buildFromTemplate(getTrayTemplate()))
  state.tray.on('click', () => showMainWindow())

  registerProtocol()

  mainWindow.once('ready-to-show', () => {
    if (
      ((state.isShown || state.isInitialLoading) && !isDevelopment) ||
      getOsType === 'windows'
    ) {
      mainWindow.show()
    }
    state.isInitialLoading = false
  })

  mainWindow.on('show', () => {
    state.isShown = true
  })

  mainWindow.on('hide', () => {
    state.isShown = false
  })

  mainWindow.webContents.on('new-window', (e, _url) => {
    handleNavigation(_url, e)
  })
  mainWindow.webContents.on('will-navigate', (e, _url) => {
    handleNavigation(_url, e)
  })
  mainWindow.webContents.on('did-navigate', (e, _url) => {
    handleRedirect(_url)
  })

  mainWindow.on('close', e => {
    if (app.quitting) {
      state.mainWindow = null
    } else {
      e.preventDefault()
      mainWindow.hide()
    }
  })
}

ipcMain.on('addBadge', (e, badge) => {
  const { tray, mainWindow } = state
  // eslint-disable-next-line global-require
  const { formatMessage } = require('../i18n')

  switch (getOsType) {
    case 'windows':
      tray.setImage(trayBlueWindowsIcon)
      mainWindow.setOverlayIcon(
        overlayIcon,
        formatMessage(messages.windowsBadgeIconTitle, {
          amount: parseInt(badge, 10),
        }),
      )
      break
    case 'mac':
      tray.setImage(trayBlueIcon)
      app.dock.setBadge(String(badge))
      break
    default:
      tray.setImage(trayBlueIcon)
      app.setBadgeCount(Number(badge))
      break
  }
})

ipcMain.on('removeBadge', () => {
  removeBadge()
})

ipcMain.on('onConnectionEvent', (e, name, text) => {
  log.info('on-connection-event', name, text || '')
})

ipcMain.on('domainChange', (e, { type, domain, protocol }) => {
  store.set('currentDomainType', type)
  if (type === 'onPremises') {
    store.set('host.onPremisesProtocol', protocol)
    store.set('host.onPremisesDomain', domain)
  }

  loadUrl(getChatUrl())
})

ipcMain.on('loadChat', () => {
  loadUrl(getChatUrl())
})

ipcMain.on('chatRedirect', (e, url) => {
  handleRedirect(url)
})

ipcMain.on('openWindow', (e, url) => {
  handleNavigation(url)
})

ipcMain.on('showMainWindow', () => {
  state.mainWindow.show()
})

ipcMain.on('bounceIcon', () => {
  if (getOsType === 'mac') app.dock.bounce()
})

ipcMain.on('electron-dl:download', (event, { options, url, partition }) => {
  const webviewSession = session.fromPartition(partition)

  webviewSession.downloadURL(url)

  const listener = (e, item) => {
    registerListener(
      webviewSession,
      {
        ...options,
        webview: {
          event: e,
          item,
          webContents: state.mainWindow.webContents,
        },
      },
      (error, i) => {
        if (options.unregisterWhenDone) {
          webviewSession.removeListener('will-download', listener)
        }
        event.reply('electron-context-menu:saved', { error, item: i })
      },
    )
  }

  webviewSession.on('will-download', listener)

  event.reply('receivedDownloadOptions')
})
