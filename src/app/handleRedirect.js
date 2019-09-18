// eslint-disable-next-line import/no-extraneous-dependencies
import { Menu } from 'electron'
import state from '../state'
// eslint-disable-next-line import/no-cycle
import { getMenuTemplate } from '../menu'

export default (e, url) => {
  const { protocol } = new URL(url)
  if (protocol.slice(0, -1) !== 'file') {
    state.isSettingsVisible = true
  } else {
    state.isSettingsVisible = false
  }

  Menu.setApplicationMenu(Menu.buildFromTemplate(getMenuTemplate()))
}
