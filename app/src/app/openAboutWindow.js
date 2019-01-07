// eslint-disable-next-line import/no-extraneous-dependencies
import { BrowserWindow } from 'electron'
import { urls } from '../constants/pages'

export default () => {
  const win = new BrowserWindow({
    resizable: false,
    width: 400,
    height: 340,
    show: false,
    useContentSize: true,
    minimizable: false,
    maximizable: false,
    webPreferences: {
      nodeIntegration: false,
    },
  })
  win.setMenu(null)
  win.loadURL(urls.about)
  win.once('ready-to-show', () => {
    win.show()
  })
}
