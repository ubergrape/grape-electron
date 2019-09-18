// eslint-disable-next-line import/no-extraneous-dependencies
import { Menu } from 'electron'

import state from '../state'
// eslint-disable-next-line import/no-cycle
import { getMenuTemplate } from '../menu'

export default (e, url) => {
  const { protocol, pathname } = new URL(url)
  if (protocol !== 'file:' && pathname === '/chat/') {
    state.isSettingsVisible = true
  } else {
    state.isSettingsVisible = false
  }

  Menu.setApplicationMenu(Menu.buildFromTemplate(getMenuTemplate()))
}
