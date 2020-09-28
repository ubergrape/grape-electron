// eslint-disable-next-line import/no-extraneous-dependencies
import { ipcRenderer, shell } from 'electron'
import pkg from '../../../package.json'

const addBadge = text => {
  ipcRenderer.send('addBadge', text)
}

const removeBadge = () => {
  ipcRenderer.send('removeBadge')
}

const bounceIcon = () => {
  ipcRenderer.send('bounceIcon')
}

const showMainWindow = () => {
  ipcRenderer.send('showMainWindow')
}

const onCallStarted = () => {
  ipcRenderer.send('onCallStarted')
}

const onCallFinished = () => {
  ipcRenderer.send('onCallFinished')
}

const setWebClientVersion = version => {
  ipcRenderer.send('setWebClientVersion', version)
}

const onConnectionEvent = (name, text) => {
  ipcRenderer.send('onConnectionEvent', name, text)
}

const openExternal = href => {
  shell.openExternal(href)
}

const showNotification = (...args) => {
  let properties
  let params
  let callbacks
  let dependencies

  // Handling of changing API for showNotification function, but old browser clients should also be supported.
  if (args[1]) {
    // Handling notifications for old browser clients (grape-web-client < 1.42.2, grape-web < 1.9.5)
    ;[properties, callbacks, dependencies, params] = args
    const { createWebNotification } = dependencies
    createWebNotification(properties, callbacks, params)
  } else {
    // New web-client
    // Handling notifications for new browser clients (grape-web-client >= 1.42.2, grape-web >= 1.9.5)
    // eslint-disable-next-line prefer-destructuring
    ;({ properties, params, callbacks, dependencies } = args[0])
    const { createWebNotification } = dependencies
    createWebNotification({
      properties,
      params,
      callbacks,
    })
  }
}

window.grapeAppVersion = pkg.version

window.grapeAppBridge = {
  addBadge,
  removeBadge,
  onCallStarted,
  onCallFinished,
  setWebClientVersion,
  bounceIcon,
  showMainWindow,
  onConnectionEvent,
  openExternal,
  showNotification,
}
