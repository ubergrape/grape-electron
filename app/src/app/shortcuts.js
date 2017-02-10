import {globalShortcut, BrowserWindow} from 'electron'

const shortcuts = {
  'Alt+CmdOrCtrl+I': () => {
    const win = BrowserWindow.getFocusedWindow()
    if (win) win.toggleDevTools()
  }
}

export function register() {
  for (const name in shortcuts) {
    globalShortcut.register(name, shortcuts[name])
  }
}
