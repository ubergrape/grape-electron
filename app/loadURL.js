import handleOffline from './handleOffline'

export default function(url) {
  if (!url) return
  handleOffline(url)
}
