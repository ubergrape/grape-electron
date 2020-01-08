// eslint-disable-next-line import/no-cycle
import loadApp from '../../loadApp'
import { pages } from '../../../constants'

export default () => {
  loadApp(pages.domain)
}
