import { autoUpdater } from 'electron-updater'

// eslint-disable-next-line import/no-cycle
import resetUpdateTimer from './resetUpdateTimer'
import state from '../../state'

export default () => {
  state.checkingForUpdateAutomatically = true
  autoUpdater.autoDownload = false
  autoUpdater.checkForUpdates().then(() => {
    state.checkingForUpdateAutomatically = false
    if (!state.shouldCheckUpdateLater) resetUpdateTimer()
  })
}
