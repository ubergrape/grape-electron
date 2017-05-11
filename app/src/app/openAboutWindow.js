import {logo} from '../constants/images'
import {
  app,
  BrowserWindow
} from 'electron'
import {urls} from '../constants/pages'
import state from './state'

export default () => {
  const win = new BrowserWindow({
    resizable: false,
    width: 400,
    height: 340,
    show: false,
    useContentSize: true,
    minimizable: false,
    maximizable: false
  })
  win.loadURL(urls.about)
  win.once('ready-to-show', () => {
    win.show()
  })
}
