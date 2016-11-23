import {app} from 'electron'
import url from 'url'

import state from './state'
import {urls} from '../constants/pages'
import {isWindows} from './utils'
import ensureFocus from './ensureFocus'

export const protocol = 'chatgrape'

let lastUrl

const actions = {
  login: (urlObj) => {
    const {mainWindow: win} = state
    win.webContents.once('dom-ready', () => {
      const token = urlObj.path.substr(1)
      const postUrl = url.format({
        protocol: state.host.protocol,
        host: state.host.domain,
        pathname: '/accounts/tokenauth/'
      })
      win.webContents.send('submitAuthToken', {token, url: postUrl})
    })
    win.loadURL(urls.tokenAuth)
  }
}

export function handle() {
  if (!lastUrl || !state.mainWindow) return false

  const urlObj = url.parse(lastUrl)
  const action = actions[urlObj.host]

  if (!action) return false

  ensureFocus()
  action(urlObj)
  lastUrl = null
  return true
}

export function register() {
  app.setAsDefaultProtocolClient(protocol)

  app.on('open-url', (e, url) => {
    e.preventDefault()
    lastUrl = url
    handle()
  })
}
