// eslint-disable-next-line import/no-extraneous-dependencies
import { app } from 'electron'
import minimatch from 'minimatch'
import url from 'url'
import log from 'electron-log'

import state from '../state'
import { getBaseUrl } from '../utils'
import { pages } from '../constants'
import loadApp from './loadApp'
import ensureFocus from './ensureFocus'
import { openWindow } from './handleNavigation'

export const grapeProtocol = 'chatgrape'

const actions = {
  login: urlObj => {
    const { mainWindow } = state
    mainWindow.webContents.once('dom-ready', () => {
      const { protocol, host } = new URL(getBaseUrl())
      const token = urlObj.path.substr(1)
      const postUrl = url.format({
        protocol,
        host,
        pathname: '/accounts/tokenauth/',
      })
      mainWindow.webContents.send('submitAuthToken', { token, url: postUrl })
    })
    loadApp(pages.tokenAuth)
  },
  grapecall: urlObj => {
    const { hostname, path } = urlObj
    openWindow(`https://${hostname}${path}`)
  },
}

export const handle = () => {
  const { lastUrl } = state
  if (!lastUrl || !state.mainWindow) return false

  const urlObj = url.parse(lastUrl)

  let actionName = urlObj.host

  if (minimatch(url, '**/call/*')) {
    actionName = 'grapecall'
  }

  const action = actions[actionName]

  if (!action) return false

  ensureFocus()
  action(urlObj)
  state.lastUrl = null
  return true
}

export const register = () => {
  app.setAsDefaultProtocolClient(grapeProtocol)

  app.on('open-url', (e, address) => {
    log.info('open-url', e, address)
    e.preventDefault()

    state.lastUrl = address
    handle()
  })
}
