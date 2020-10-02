import { autoUpdater } from 'electron-updater'

import state from '../../state'
import onUpdateDownloaded from './onUpdateDownloaded'

export default () => {
  autoUpdater.on('update-downloaded', () => {
    state.isUpdateDownloaded = true
    state.isUpdateDownloading = false

    onUpdateDownloaded()
  })
}
