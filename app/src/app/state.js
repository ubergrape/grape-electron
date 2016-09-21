import env from './env'
import clone from 'lodash.clone'
const state = {
  host: clone(env.host)
}

state.getUrl = function getUrl() {
  return `${this.host.protocol}://${this.host.domain}/${this.host.path}`
}

state.getUrl = state.getUrl.bind(state)
export default state
