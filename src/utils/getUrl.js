// eslint-disable-next-line import/no-cycle
import store from '../store'

export default () =>
  `${store.get('host.protocol')}://${store.get('host.onPremisesDomain') ||
    store.get('host.cloudDomain')}/${store.get('host.path')}`
