import { pages, blobs } from '../constants'
import state from '../state'
import { matchOne } from '../utils'

const loadUrl = (url, window = state.mainWindow) => {
  if (!url) return

  const handleOffline = (e, code) => {
    // https://cs.chromium.org/chromium/src/net/base/net_error_list.h
    if (code === -3) return
    loadUrl(pages.connectionError)
  }

  let certificateError = false
  let response = false

  const { webContents } = window

  webContents.once('did-fail-load', (e, code) => {
    if (certificateError) return
    handleOffline(e, code)
  })

  webContents.once('did-finish-load', () => {
    response = true
  })

  webContents.once('certificate-error', () => {
    certificateError = true
    loadUrl(`${pages.certificateError}&url=${url}`)
  })

  if (certificateError) return

  setTimeout(() => {
    if (!response) handleOffline()
    response = false
  }, 10000)

  if (
    matchOne(blobs.protocolBlobs, url) &&
    matchOne(blobs.mainWindowBlobs, url)
  ) {
    loadUrl(`${pages.chat}&url=${url}`)
    return
  }

  window.loadURL(url)
}

export default loadUrl
