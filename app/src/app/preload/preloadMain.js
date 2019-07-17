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
  let isShow = false

  callbacks.forEach(callback => {
    const event = random(10000)
    ipcRenderer.once(event, callback)

    setTimeout(() => {
      ipcRenderer.removeAllListeners(event)
    }, notificationClickTimeout)

    if (!isShow) {
      isShow = true

      // This will show Windows Tray Balllon in Windows < 10.
      ipcRenderer.send('showNotification', {
        event,
        title,
        message: content,
      })
    }
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
