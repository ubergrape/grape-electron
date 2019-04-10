import { app } from 'electron'
import minimatch from 'minimatch'
import url from 'url'

import state from './state'
import { urls } from '../constants/pages'
import ensureFocus from './ensureFocus'
import loadApp from './loadApp'
import { openWindow } from './handleLocations'

export const protocol = 'chatgrape'

let lastUrl

const actions = {
  login: urlObj => {
    const { mainWindow: win } = state
    win.webContents.once('dom-ready', () => {
      const token = urlObj.path.substr(1)
      const postUrl = url.format({
        protocol: state.host.protocol,
        host: state.host.domain,
        pathname: '/accounts/tokenauth/',
      })
      win.webContents.send('submitAuthToken', { token, url: postUrl })
    })
    loadApp(urls.tokenAuth)
  },
  grapecall: urlObj => {
    openWindow(`https://${urlObj.hostname}${urlObj.path}`)
  },
}

export function handle() {
  if (!lastUrl || !state.mainWindow) return false

  const urlObj = url.parse(lastUrl)

  let actionName = urlObj.host
  if (minimatch(lastUrl, '**/call/jitsire/*')) {
    actionName = 'grapecall'
  }

  const action = actions[actionName]

  if (!action) return false

  ensureFocus()
  action(urlObj)
  lastUrl = null
  return true
}

export function register() {
  app.setAsDefaultProtocolClient(protocol)

  app.on('open-url', (e, url) => {
    console.log('open-url', e, url)
    e.preventDefault()
    lastUrl = url
    handle()
  })
}
