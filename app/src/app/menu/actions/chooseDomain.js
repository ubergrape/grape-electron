import state from '../../state'
import { urls } from '../../../constants/pages'

export default () => {
  state.mainWindow.loadURL(urls.domain)
}
