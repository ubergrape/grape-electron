import {urls} from './constants'

const responseTimeout = 10000

export default function handleOffline(url, win) {
  function offline(e, code) {
    if (code === -3) return // Redirect
    win.loadURL(urls.lostConection)
  }
  let response = false
  const {webContents} = win
  webContents.on('did-fail-load', offline)
  webContents.on('did-get-response-details', function onDidResponse() {
    response = true
    webContents.removeListener('did-fail-load', offline)
    webContents.removeListener('did-get-response-details', onDidResponse)
  })

  if (url) win.loadURL(url)

  setTimeout(() => {
    if (!response) offline()
    response = false
  }, responseTimeout)
}
