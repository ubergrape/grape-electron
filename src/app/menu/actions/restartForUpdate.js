// eslint-disable-next-line import/no-extraneous-dependencies
import { app } from 'electron'
import { autoUpdater } from 'electron-updater'

import state from '../../../state'

export default () => {
  setImmediate(() => {
    app.removeAllListeners('window-all-closed')
    if (state.mainWindow) {
      state.mainWindow.close()
    }
    if (state.secondaryWindow) {
      state.secondaryWindow.close()
    }
    autoUpdater.quitAndInstall()
  })
}
