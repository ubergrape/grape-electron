import state from '../../state'
import { isWindows } from '../../utils'

export default function showMainWindow() {
  const { mainWindow } = state
  if (isWindows()) mainWindow.setSkipTaskbar(false)
  mainWindow.show()
  mainWindow.focus()
}
