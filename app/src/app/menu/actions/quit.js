import { app } from 'electron'
import state from '../../state'

export default function() {
  state.preventClose = false
  app.quit()
}
