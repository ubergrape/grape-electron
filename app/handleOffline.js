import state from './state'

const responseTimeout = 10000

function offline(e, code) {
  if (code === -3) return // Redirect
  state.mainWindow.loadURL('file://' + __dirname + '/html/lost-connection.html')
}

export default function(url) {
  let response = false
  const {webContents} = state.mainWindow
  webContents.on('did-fail-load', offline)
  webContents.on('did-get-response-details', function onDidResponse() {
    response = true
    webContents.removeListener('did-fail-load', offline)
    webContents.removeListener('did-get-response-details', onDidResponse)
  })

  if (url) state.mainWindow.loadURL(url)

  setTimeout(() => {
    if (!response) offline()
    response = false
  }, responseTimeout)

}
