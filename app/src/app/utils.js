import minimatch from 'minimatch'
import { parse } from 'url'

const os = require('os')

export function isWindows() {
  return os.type() === 'Windows_NT'
}

export function isOSX() {
  return os.type() === 'Darwin'
}

export function osType() {
  if (isWindows()) return 'win'
  if (isOSX()) return 'osx'
}

export function isNotificationSupported() {
  // In windows we use trayIcon.displayBalloon and flashFrame
  // instead of Native notifications.
  return !isWindows()
}

function getHost(url) {
  const withoutProtocol = url.split('//')[1]
  if (withoutProtocol) return withoutProtocol.split('/')[0]
  return null
}

export function isExternalUrl(url, current) {
  if (!url || !current) return true

  const newHost = getHost(url)
  const currentHost = getHost(current)
  if (!newHost) return true
  return !minimatch(newHost, `**${currentHost}`)
}

export function isChatUrl(url) {
  return (
    parse(url)
      .pathname.split('/')
      // remove empty array elements:
      //
      // '/some/path'.split('/')
      // > ["", "some", "path"]
      // '//some/path'.split('/')
      // > ["", "", "some", "path"]
      .filter(p => p !== '')[0] === 'chat'
  )
}
