/* eslint-disable import/no-cycle */
import store from '../store'
import getBaseUrl from './getBaseUrl'
/* eslint-enable import/no-cycle */

export default () => `${getBaseUrl()}/${store.get('host.path')}`
