import state from './state'
import {shell} from 'electron'

function openExternal(e, url) {
  e.preventDefault()
  shell.openExternal(url)
}

export default function() {
  const {webContents} = state.mainWindow
  webContents.on('new-window', openExternal)
  webContents.on('will-navigate', openExternal)
}

