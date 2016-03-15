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
