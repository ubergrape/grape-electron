// eslint-disable-next-line import/no-cycle
import loadApp from '../../app/loadApp'
import { getUrlToLoad } from '../../utils'
import store from '../../store'

export default () => {
  const url = getUrlToLoad(store)
  loadApp(url)
}
