// eslint-disable-next-line import/no-extraneous-dependencies
const { desktopCapturer } = require('electron')

global.grapeCallBridge = {
  desktopCapturer,
}
