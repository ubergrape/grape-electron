import { pages } from '../constants'

export default store => {
  const lastUrl = store.get('lastUrl')

  if (lastUrl) return lastUrl

  return pages.domain
}
