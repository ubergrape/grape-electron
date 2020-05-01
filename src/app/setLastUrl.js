import store from '../store'
import state from '../state'
import { getPageParams } from '../utils'

export default () => {
  if (state.mainWindow) {
    const currentUrl = state.mainWindow.webContents.getURL()

    const { page, url } = getPageParams(currentUrl)
    if (page === 'chat') {
      store.set('lastUrl', url)
    } else {
      store.set('lastUrl', currentUrl)
    }
  }
}
