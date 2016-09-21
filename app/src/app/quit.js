import {app} from 'electron'
import state from './state'

export default function() {
  state.dontPreventClose = true
  app.quit()
}
