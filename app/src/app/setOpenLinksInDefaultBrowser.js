import minimatch from 'minimatch'
import state from './state'
import {shell} from 'electron'

const internals = [
  '**/chat/**',
  '**/chat',
  '**/accounts/tokenauth',
  '**/accounts/logout',
  '**/accounts/login',
  '**/accounts/login/**',
  '**/accounts/complete/**',
  '**/accounts/settings',
  '**/accounts/settings/**',
  '**/organization/dashboard',
  '**/accounts.google.com/**',
  '**/github.com/login**'
]

function removeTrailingSlash(str) {
  return str[str.length - 1] === '/' ? str.slice(0, -1) : str
}

function shouldOpenedInternal(url) {
  return internals
    .some(internalUrl => minimatch(url, internalUrl))
}

function openExternal(e, url) {
  if (
    url.startsWith('file://') ||
    shouldOpenedInternal(removeTrailingSlash(url))
  ) return
  e.preventDefault()
  shell.openExternal(url)
}

export default function() {
  const {webContents} = state.mainWindow
  webContents.on('new-window', openExternal)
  webContents.on('will-navigate', openExternal)
}

