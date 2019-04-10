const { ipcRenderer } = require('electron')

const addBadge = text => {
  ipcRenderer.send('addBadge', text)
}

const removeBadge = () => {
  ipcRenderer.send('removeBadge')
}

const onConnectionEvent = (name, log) => {
  ipcRenderer.send('onConnectionEvent', name, log)
}

window.GrapeAppBridge = {
  removeBadge,
  addBadge,
  onConnectionEvent,
}
