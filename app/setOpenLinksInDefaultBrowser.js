import minimatch from 'minimatch'
import state from './state'
import {shell} from 'electron'

const openInrternal = [
  '**/chat/**',
  '**/chat',
  '**/accounts/logout',
  '**/accounts/login',
  '**/organization/dashboard'
]

function removeTrailingSlash(str) {
  return str[str.length - 1] === '/' ? str.slice(0, -1) : str
}

function shouldOpenedInternal(url) {
  return openInrternal
    .some(internalUrl => minimatch(url, internalUrl))
}

function openExternal(e, url) {
  if (shouldOpenedInternal(removeTrailingSlash(url))) return
  e.preventDefault()
  shell.openExternal(url)
}

export default function() {
  const {webContents} = state.mainWindow
  webContents.on('new-window', openExternal)
  webContents.on('will-navigate', openExternal)
}

