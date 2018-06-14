import { urls } from '../constants/pages'
import state from './state'

const responseTimeout = 10000

export default function handleOffline(url, win) {
  function offline(e, code) {
    if (code === -3) return // Redirect
    win.loadURL(urls.connectionError)
  }
  let response = false
  const { webContents } = win
  webContents.once('did-fail-load', offline)
  webContents.once('did-get-response-details', () => {
    response = true
  })
  webContents.once('certificate-error', () => {
    win.loadURL(`${urls.certificateError}&url=${url}`)
  })

  if (url) win.loadURL(url)

  setTimeout(() => {
    if (!response) offline()
    response = false
  }, responseTimeout)
}
