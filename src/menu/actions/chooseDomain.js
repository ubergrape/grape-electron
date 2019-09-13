// eslint-disable-next-line import/no-extraneous-dependencies
import loadApp from '../../app/loadApp'
import { pages } from '../../constants'

export default () => {
  loadApp(pages.domain)
}
