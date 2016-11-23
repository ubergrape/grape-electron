import state from './state'

/**
 * Makes sure window is in focus.
 * Maximizes window if needed.
 */
export default function ensureFocus(win = state.mainWindow) {
  if (!win) return false
  if (win.isMinimized()) win.restore()
  win.focus()
  return true
}
