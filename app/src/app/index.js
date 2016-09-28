// This is main process of Electron, started as first thing when your
// app starts. This script is running through entire life of your application.
// It doesn't have any windows which you can see on screen, but we can open
// window from here.
import {app} from 'electron'

app.on('ready', () => {
  require('./initApp')
})
