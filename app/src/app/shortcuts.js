import {globalShortcut, BrowserWindow} from 'electron'

const shortcuts = {
  'Alt+CmdOrCtrl+I': () => {
    BrowserWindow.getFocusedWindow().toggleDevTools()
  }
}

export function register() {
  for (const name in shortcuts) {
    globalShortcut.register(name, shortcuts[name])
  }
}
