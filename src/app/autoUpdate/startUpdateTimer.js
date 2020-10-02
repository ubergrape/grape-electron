// eslint-disable-next-line import/no-cycle
import checkForUpdateAutomatically from './checkForUpdateAutomatically'
import onUpdateDownloaded from './onUpdateDownloaded'
import state from '../../state'
import { delays } from '../../constants'

export default () => {
  if (state.isUpdateDownloaded) {
    onUpdateDownloaded()
    return
  }

  state.updateInterval = setInterval(() => {
    if (!state.checkingForUpdateAutomatically) {
      if (state.shouldCheckUpdateLater) {
        if (state.updateCounter === delays.checkLaterDelay) {
          checkForUpdateAutomatically()
          return
        }

        state.updateCounter += 1
        return
      }

      if (state.updateCounter === delays.defaultDelay) {
        checkForUpdateAutomatically()
        return
      }

      state.updateCounter += 1
    }
  }, 1000)
}
