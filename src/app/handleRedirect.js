// eslint-disable-next-line import/no-extraneous-dependencies
import { Menu } from 'electron'

import { matchOne } from '../utils'
import { blobs } from '../constants'
import state from '../state'
import { getMenuTemplate } from './menu'

export default url => {
  const { protocol } = new URL(url)
  if (protocol === 'file:' && matchOne(url, blobs.chatBlobs)) {
    state.isSettingsVisible = true
  } else {
    state.isSettingsVisible = false
  }

  Menu.setApplicationMenu(Menu.buildFromTemplate(getMenuTemplate()))
}
