// eslint-disable-next-line import/no-extraneous-dependencies
import { globalShortcut, BrowserWindow } from 'electron'

const shortcuts = {
  'Alt+CmdOrCtrl+I': () => {
    const win = BrowserWindow.getFocusedWindow()
    if (win) win.toggleDevTools()
  },
}

const register = () => {
  Object.keys(shortcuts).forEach(name => {
    globalShortcut.register(name, shortcuts[name])
  })
}

const unregister = () => {
  Object.keys(shortcuts).forEach(name => {
    globalShortcut.unregister(name)
  })
}

export { register, unregister }
