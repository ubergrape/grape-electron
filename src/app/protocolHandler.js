// eslint-disable-next-line import/no-extraneous-dependencies
import { app } from 'electron'
import url from 'url'
import log from 'electron-log'

import state from '../state'
import ensureFocus from './ensureFocus'
import { openWindow } from './handleNavigation'

export const grapeProtocol = 'chatgrape'

const actions = {
  call: urlObj => {
    const { hostname, path } = urlObj
    openWindow(`https://${hostname}${path}`)
  },
}

export const handle = () => {
  const { lastUrl } = state
  if (!lastUrl || !state.mainWindow) return false

  const urlObj = url.parse(lastUrl)
  const action = actions.call

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
