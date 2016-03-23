import {app} from 'electron'
import devHelper from './vendor/electron_boilerplate/dev_helper'
import env from './env'
import state from './state'
import quit from './quit'

let mainMenu = [{
  label: "Application",
  submenu: [
    { label: "About Grape", selector: "orderFrontStandardAboutPanel:" },
    { type: "separator" },
    { label: "Quit", accelerator: "Command+Q", click: quit }
    ]
  },{
  label: "Edit",
  submenu: [
      { label: "Undo", accelerator: "CmdOrCtrl+Z", selector: "undo:" },
      { label: "Redo", accelerator: "Shift+CmdOrCtrl+Z", selector: "redo:" },
      { type: "separator" },
      { label: "Cut", accelerator: "CmdOrCtrl+X", selector: "cut:" },
      { label: "Copy", accelerator: "CmdOrCtrl+C", selector: "copy:" },
      { label: "Paste", accelerator: "CmdOrCtrl+V", selector: "paste:" },
      { label: "Select All", accelerator: "CmdOrCtrl+A", selector: "selectAll:" }
  ]}
]

export const main = env.name !== 'production' ? mainMenu.concat(devHelper.menu) : mainMenu

export const tray = [
  { label: "Open", click: function() {
      state.mainWindow.show()
      state.mainWindow.focus()
    }
  },
  { label: "Quit", click: quit }
]
