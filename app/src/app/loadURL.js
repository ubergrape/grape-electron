import handleOffline from './handleOffline'
import state from './state'

export default function loadURL(url, win = state.mainWindow) {
  if (!url) return
  handleOffline(url, win)
}
