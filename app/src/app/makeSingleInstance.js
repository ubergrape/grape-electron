// eslint-disable-next-line import/no-extraneous-dependencies
import { app } from 'electron'
// import url from 'url'

// import { protocol } from './protocolHandler'
// import ensureFocus from './ensureFocus'

// const matchesProtocol = str => url.parse(str).protocol === `${protocol}:`

// const event = {
//   isFake: true,
//   preventDefault: () => null,
// }

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
 */
export default function makeSingleInstance() {
  if (process.mas) return false

  return !app.requestSingleInstanceLock()

  // TODO
  // app.on('second-instance', () => {
  //   if (mainWindow) {
  //     if (mainWindow.isMinimized()) mainWindow.restore()
  //     mainWindow.focus()
  //   }
  // })
}
