import state from '../state'

export default (win = state.mainWindow) => {
  if (!win) return false
  if (win.isMinimized()) win.restore()
  win.focus()
  return true
}
