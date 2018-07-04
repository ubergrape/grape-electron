import { env } from '../../package.json'
import rc from './rc'

if (rc.domain) {
  env.host.domain = rc.domain
  env.chooseDomainDisabled = true
}

if (rc.startInBackgroundWhenAutostarted != null) {
  env.startInBackgroundWhenAutostarted = rc.startInBackgroundWhenAutostarted
}

export default env
