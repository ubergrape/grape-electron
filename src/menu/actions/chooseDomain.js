// eslint-disable-next-line import/no-cycle
import loadApp from '../../app/loadApp'
import { pages } from '../../constants'

export default () => {
  loadApp(pages.domain)
}