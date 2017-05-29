import {globalShortcut, BrowserWindow, app} from 'electron'

const shortcuts = {
  'Alt+CmdOrCtrl+I': () => {
    const win = BrowserWindow.getFocusedWindow()
    if (win) win.toggleDevTools()
  }
}

function unreg() {
  for (const name in shortcuts) {
    globalShortcut.unregister(name)
  }
}

function reg() {
  for (const name in shortcuts) {
    globalShortcut.register(name, shortcuts[name])
  }
}

export function register() { 
  app.on('browser-window-focus', reg)
  app.on('browser-window-blur', unreg)
  app.on('will-quit', unreg)
}
