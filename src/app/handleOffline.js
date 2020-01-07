// eslint-disable-next-line import/no-cycle
import loadApp from './loadApp'
import { pages } from '../constants'

const offline = (e, window, code) => {
  // https://cs.chromium.org/chromium/src/net/base/net_error_list.h
  if (code === -3) return
  loadApp(pages.connectionError)
}

export default (url, window) => {
  let certificateError = false
  let response = false
  const { webContents } = window

  webContents.once('did-fail-load', (e, code) => {
    if (certificateError) return
    offline(e, window, code)
  })

  webContents.once('did-finish-load', () => {
    response = true
  })

  webContents.once('certificate-error', () => {
    certificateError = true
    loadApp(`${pages.certificateError}&url=${url}`)
  })

  if (certificateError) return
  if (url) window.loadURL(url)

  setTimeout(() => {
    if (!response) offline()
    response = false
  }, 10000)
}
