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

const showNotification = (options, callback, dependencies) => {
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
}

const openExternal = href => {
  shell.openExternal(href)
}

window.GrapeAppBridge = {
  removeBadge,
  addBadge,
  onConnectionEvent,
  showNotification,
  openExternal,
}
