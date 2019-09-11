// eslint-disable-next-line import/no-extraneous-dependencies
import { BrowserWindow } from 'electron'
import { grayLighter } from 'grape-theme/dist/base-colors'

import urls from '../../constants/pages'
import state from '../../state'

export default () => {
  const aboutWindow = new BrowserWindow({
    width: 400,
    height: 340,
    resizable: false,
    show: false,
    useContentSize: true,
    minimizable: false,
    maximizable: false,
    backgroundColor: grayLighter,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  })

  aboutWindow.once('ready-to-show', () => {
    aboutWindow.show()
  })

  aboutWindow.on('close', () => {
    state.aboutWindow = null
  })

  aboutWindow.loadURL(urls.about)
}
