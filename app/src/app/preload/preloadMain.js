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

const notificationClickTimeout = 30000

const showNotification = (options, callbacks, dependencies, params) => {
  // Code inside of this check should be removed withiin sometime
  if (typeof callbacks !== 'object') {
    const callback = callbacks
    const { createWebNotification, random } = dependencies

    if (remote.getGlobal('isNotificationSupported')) {
      createWebNotification(options, callback)
      return
    }

    const event = random(10000)
    const { title, content } = options

    ipcRenderer.once(event, callback)

    // This will show Windows Tray Balllon in Windows < 10.
    ipcRenderer.send('showNotification', {
      event,
      title,
      message: content,
    })

    setTimeout(() => {
      ipcRenderer.removeAllListeners(event)
    }, notificationClickTimeout)
    return
  }

  const { createWebNotification, random } = dependencies

  if (remote.getGlobal('isNotificationSupported')) {
    createWebNotification(options, callbacks, params)
    return
  }

  const { title, content } = options

  const onClick = random(100000)
  const onClose = random(100000)
  if (callbacks.onClick) ipcRenderer.once(onClick, callbacks.onClick)
  if (callbacks.onClose) ipcRenderer.once(onClose, callbacks.onClose)

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
