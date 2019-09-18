// eslint-disable-next-line import/no-cycle
import store from '../store'

export default () => {
  const type = store.get('currentDomainType')

  if (type === 'cloud') {
    return `${store.get('host.cloudProtocol')}://${store.get(
      'host.cloudDomain',
    )}`
  }

  return `${store.get('host.onPremisesProtocol')}://${store.get(
    'host.onPremisesDomain',
  )}`
}
