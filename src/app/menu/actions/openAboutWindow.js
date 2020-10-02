// eslint-disable-next-line import/no-extraneous-dependencies
import { BrowserWindow } from 'electron'
import { grayLighter } from 'grape-theme/dist/base-colors'
import windowStateKeeper from 'electron-window-state'

import { pages } from '../../../constants'
import state from '../../../state'

export default () => {
  const aboutWindowState = windowStateKeeper({
    file: 'about-window-state.json',
  })

  const aboutWindow = new BrowserWindow({
    width: 400,
    height: 340,
    x: aboutWindowState.x,
    y: aboutWindowState.y,
    resizable: false,
    show: false,
    useContentSize: true,
    minimizable: false,
    maximizable: false,
    backgroundColor: grayLighter,
    webPreferences: {
      nodeIntegration: true,
    },
  })

  aboutWindowState.manage(aboutWindow)

  aboutWindow.removeMenu()

  aboutWindow.once('ready-to-show', () => {
    aboutWindow.show()
  })

  aboutWindow.on('close', () => {
    state.aboutWindow = null
  })

  aboutWindow.loadURL(pages.about)
}
