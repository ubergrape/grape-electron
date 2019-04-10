import { ipcRenderer } from 'electron'

const addBadge = text => {
  ipcRenderer.send('addBadge', text)
}

const removeBadge = () => {
  ipcRenderer.send('removeBadge')
}

const onConnectionEvent = (name, text) => {
  ipcRenderer.send('onConnectionEvent', name, text)
}

window.GrapeAppBridge = {
  removeBadge,
  addBadge,
  onConnectionEvent,
}
