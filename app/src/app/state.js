import clone from 'lodash.clone'
import env from './env'

function getUrl() {
  return `${this.host.protocol}://${this.host.domain}/${this.host.path}`
}

const state = {
  host: clone(env.host),
}

state.getUrl = getUrl.bind(state)

export default state
