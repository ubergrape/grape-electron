// eslint-disable-next-line import/no-cycle
import startUpdateTimer from './startUpdateTimer'
import state from '../../state'

export default checkForUpdateLater => {
  state.updateCounter = 0
  state.shouldCheckUpdateLater = false

  if (checkForUpdateLater) {
    state.shouldCheckUpdateLater = true
  }

  clearInterval(state.updateInterval)
  startUpdateTimer()
}
