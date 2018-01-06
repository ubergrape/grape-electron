import {env} from '../../package.json'
import rc from './rc'

if (Object.prototype.hasOwnProperty.call(rc, 'domain')) {
  env.host.domain = rc.domain
  env.chooseDomainDisabled = true
}

if (Object.prototype.hasOwnProperty.call(rc, 'startInBackgroundWhenAutostarted')) {
  env.startInBackgroundWhenAutostarted = rc.startInBackgroundWhenAutostarted
}

export default env
