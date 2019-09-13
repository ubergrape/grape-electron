import handleOffline from './handleOffline'

export default (url, window) => {
  if (!url) return
  handleOffline(url, window)
}
