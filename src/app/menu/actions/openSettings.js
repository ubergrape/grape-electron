// eslint-disable-next-line import/no-cycle
import loadUrl from '../../loadUrl'
import { getBaseUrl } from '../../../utils'
import state from '../../../state'

export default () => {
  loadUrl(`${getBaseUrl()}/accounts/settings`, state.mainWindow)
}
