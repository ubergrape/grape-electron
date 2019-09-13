import production from './production'
import development from './development'
import { isDevelopment } from '../utils'

export default isDevelopment ? development : production
