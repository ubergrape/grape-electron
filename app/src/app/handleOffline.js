import { urls } from '../constants/pages'

const responseTimeout = 10000

export default function handleOffline(url, win) {
  function offline(e, code) {
    if (code === -3) return // Redirect
    win.loadURL(urls.connectionError)
  }
  let response = false
  const { webContents } = win
  webContents.once('did-fail-load', (e, code) => {
    console.log('did-fail-load', e, code)
    offline(e, code)
  })
  webContents.once('did-finish-load', () => {
    console.log('did-finish-load')
    response = true
  })
  webContents.once('certificate-error', () => {
    win.loadURL(`${urls.certificateError}&url=${url}`)
  })

  if (url) win.loadURL(url)

  setTimeout(() => {
    if (!response) {
      console.log('setTimeout 10000 offline')
      offline()
    }
    response = false
  }, responseTimeout)
}
