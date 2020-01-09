// eslint-disable-next-line import/no-extraneous-dependencies
import { Menu } from 'electron'
import minimatch from 'minimatch'

import state from '../state'
// eslint-disable-next-line import/no-cycle
import { getMenuTemplate } from './menu'

export default (e, url) => {
  const { protocol } = new URL(url)
  if (protocol !== 'file:' && minimatch(url, '**/chat/*')) {
    state.isSettingsVisible = true
  } else {
    state.isSettingsVisible = false
  }

  Menu.setApplicationMenu(Menu.buildFromTemplate(getMenuTemplate()))
}
