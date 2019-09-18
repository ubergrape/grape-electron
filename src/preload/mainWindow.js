// eslint-disable-next-line import/no-extraneous-dependencies
import { ipcRenderer, shell } from 'electron'

const addBadge = text => {
  ipcRenderer.send('addBadge', text)
}

const removeBadge = () => {
  ipcRenderer.send('removeBadge')
}

const onConnectionEvent = (name, text) => {
  ipcRenderer.send('onConnectionEvent', name, text)
}

const openExternal = href => {
  shell.openExternal(href)
}

const showNotification = (options, callbacks, dependencies, params) => {
  // eslint-disable-next-line no-console
  console.log(options, callbacks, dependencies, params)
}

window.grapeAppBridge = {
  addBadge,
  removeBadge,
  onConnectionEvent,
  openExternal,
  showNotification,
}
