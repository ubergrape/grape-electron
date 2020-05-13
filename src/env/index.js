import production from './production'
import development from './development'
// eslint-disable-next-line import/no-cycle
import { isDevelopment } from '../constants'

export default isDevelopment ? development : production
