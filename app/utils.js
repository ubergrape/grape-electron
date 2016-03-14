var os = require('os')

export function isNotificationSupported() {
  return (
      os.type() === 'Windows_NT' &&
        parseInt(os.release().split('.')[0]) < 10
  ) ? false : true
}
