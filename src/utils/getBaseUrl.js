// eslint-disable-next-line import/no-cycle
import store from '../store'

export default () => {
  const type = store.get('currentDomainType')

  const protocol =
    (type === 'cloud'
      ? store.get('host.cloudProtocol')
      : store.get('host.onPremisesProtocol')) || 'http:'

  const domain =
    type === 'cloud'
      ? store.get('host.cloudDomain')
      : store.get('host.onPremisesDomain')

  return `${protocol}//${domain}`
}
