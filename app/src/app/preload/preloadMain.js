// eslint-disable-next-line import/no-extraneous-dependencies
import { ipcRenderer, remote, shell } from 'electron'

const addBadge = text => {
  ipcRenderer.send('addBadge', text)
}

const removeBadge = () => {
  ipcRenderer.send('removeBadge')
}

const onConnectionEvent = (name, text) => {
  ipcRenderer.send('onConnectionEvent', name, text)
}

const notificationClickTimeout = 20000

const showNotification = (options, callbacks, params, dependencies) => {
  const { createWebNotification, random } = dependencies

  if (remote.getGlobal('isNotificationSupported')) {
    createWebNotification(options, callbacks, params)
    return
  }

  const { title, content } = options

  const onClick = random(100000)
  const onClose = random(100000)
  ipcRenderer.once(onClick, callbacks.onClick)
  ipcRenderer.once(onClose, callbacks.onClose)

  setTimeout(() => {
    ipcRenderer.removeAllListeners(onClick)
    ipcRenderer.removeAllListeners(onClose)
  }, notificationClickTimeout)

  // This will show Windows Tray Balllon in Windows < 10.
  ipcRenderer.send('showNotification', {
    events: {
      onClick,
      onClose,
    },
    title,
    message: content,
  })
}

const openExternal = href => {
  shell.openExternal(href)
}

window.grapeAppBridge = {
  removeBadge,
  addBadge,
  onConnectionEvent,
  showNotification,
  openExternal,
}
