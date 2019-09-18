// eslint-disable-next-line import/no-cycle
import loadUrl from '../../app/loadUrl'
import { getBaseUrl } from '../../utils'
import state from '../../state'

export default () => {
  loadUrl(`${getBaseUrl()}/accounts/settings`, state.mainWindow)
}
