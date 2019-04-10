import { ipcRenderer, remote, shell } from 'electron'

const addBadge = text => {
  ipcRenderer.send('addBadge', text)
}

const removeBadge = () => {
  ipcRenderer.send('removeBadge')
}

const onConnectionEvent = (name, text) => {
  ipcRenderer.send('onConnectionEvent', name, text)
}

const notificationClickTimeout = 20000

// http://crocodillon.com/blog/parsing-emoji-unicode-in-javascript
const emojiRegExp = new RegExp(
  [
    '\\ud83c[\\udf00-\\udfff]', // U+1F300 to U+1F3FF
    '\\ud83d[\\udc00-\\ude4f]', // U+1F400 to U+1F64F
    '\\ud83d[\\ude80-\\udeff]', // U+1F680 to U+1F6FF
  ].join('|'),
  'g',
)

/**
 * Replaces emoji symbol with it's text representation.
 * '👍' => ':+1:'
 */
const replaceEmojisWithText = (content, emoji) =>
  content.replace(
    emojiRegExp,
    match => `:${emoji.data[match.codePointAt().toString(16)][3][0]}:`,
  )

const showNotification = (options, callback, dependencies) => {
  const { createWebNotification, emoji, random } = dependencies

  if (remote.getGlobal('isNotificationSupported')) {
    createWebNotification(options, callback)
    return
  }

  const event = random(10000)
  const { title, content } = options

  ipcRenderer.once(event, callback)

  // This will show Windows Tray Balllon in Windows < 10.
  ipcRenderer.send('showNotification', {
    event,
    title,
    message: replaceEmojisWithText(content, emoji),
  })

  setTimeout(() => {
    ipcRenderer.removeAllListeners(event)
  }, notificationClickTimeout)
}

const openExternal = href => {
  shell.openExternal(href)
}

window.GrapeAppBridge = {
  removeBadge,
  addBadge,
  onConnectionEvent,
  showNotification,
  openExternal,
}
