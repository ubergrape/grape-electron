var os = require('os')

export function isWindows() {
  return os.type() === 'Windows_NT'
}

export function isOSX() {
  return os.type() === 'Darwin'
}

export function isNotificationSupported() {
  return (
      isWindows() &&
        parseInt(os.release().split('.')[0]) < 10
  ) ? false : true
}

function getHost(url) {
  const withoutProtocol = url.split('//')[1]
  if (withoutProtocol) return withoutProtocol.split('/')[0]
  return null
}

export function isExternalUrl(url, current) {
  if (!url || !current) return true

  const newHost = getHost(url)
  const currentHost = getHost(url)
  if (!newHost) return true

  return newHost !== currentHost
}
