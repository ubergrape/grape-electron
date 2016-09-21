import devMenu from '../electron/devMenu'
import showMainWindow from './showMainWindow'
import env from './env'
import state from './state'
import quit from './quit'
import {isOSX} from './utils'
import loadApp from './loadApp'
import {urls} from '../constants/pages'

function backToChat() {
  loadApp()
}

function chooseDomain() {
  state.mainWindow.loadURL(urls.domain)
}

const mainMenu = [
  {
    label: 'Application',
    submenu: [
      {label: 'Quit', accelerator: 'Command+Q', click: quit},
      {label: 'Back to chat', click: backToChat},
      {label: 'Choose domain', click: chooseDomain}
    ]
  },
  {
    label: 'Edit',
    submenu: [
      {label: 'Undo', accelerator: 'CmdOrCtrl+Z', role: 'undo'},
      {label: 'Redo', accelerator: 'Shift+CmdOrCtrl+Z', role: 'redo'},
      {type: 'separator'},
      {label: 'Cut', accelerator: 'CmdOrCtrl+X', role: 'cut'},
      {label: 'Copy', accelerator: 'CmdOrCtrl+C', role: 'copy'},
      {label: 'Paste', accelerator: 'CmdOrCtrl+V', role: 'paste'},
      {label: 'Select All', accelerator: 'CmdOrCtrl+A', role: 'selectall'}
    ]
  }
]

if (isOSX()) mainMenu[0].submenu.push({type: 'separator'}, {label: 'About Grape', role: 'about'})


export const main = env.name !== 'production' ? mainMenu.concat(devMenu) : mainMenu

export const tray = [
  {label: 'Open', click: showMainWindow},
  {label: 'Quit', click: quit}
]
