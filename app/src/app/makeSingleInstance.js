import { app } from 'electron'
import url from 'url'

import state from './state'
import { isWindows } from './utils'
import { protocol } from './protocolHandler'
import ensureFocus from './ensureFocus'

const matchesProtocol = str => url.parse(str).protocol === `${protocol}:`

const event = {
  isFake: true,
  preventDefault: () => null,
}

/**
 * Make this app a single instance app.
 *
 * TODO: Remove this module once we upgrade to the next electron version
 * https://github.com/electron/electron/pull/8052/
 *
 * The main window will be restored and focused instead of a second window
 * opened when a person attempts to launch a second instance.
 *
 * Returns true if the current version of the app should quit instead of
 * launching.
 *
 * Inspired by https://github.com/electron/electron-api-demos/commit/e66db3a1309e54bd8bff42419b56fabb7f0a9fc7
 */
export default function makeSingleInstance() {
  if (process.mas) return false

  return app.makeSingleInstance(argv => {
    const isFocused = ensureFocus()

    if (!isFocused) return

    // On windows we have to check the second instance arguments to emit the open-url event.
    if (isWindows()) {
      // Check if the second instance was attempting to launch a URL for our protocol client.
      const url = argv.find(matchesProtocol)
      if (url) app.emit('open-url', event, url)
    }
  })
}
