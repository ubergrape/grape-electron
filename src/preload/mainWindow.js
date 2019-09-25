// eslint-disable-next-line import/no-extraneous-dependencies
import electron, { ipcRenderer, shell } from 'electron'

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
  const { createWebNotification } = dependencies
  createWebNotification(options, callbacks, params, electron)
}

window.grapeAppBridge = {
  addBadge,
  removeBadge,
  onConnectionEvent,
  openExternal,
  showNotification,
}
