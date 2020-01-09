import { defineMessages } from 'react-intl'
import state from '../../state'

import quit from './actions/quit.js'
import openAboutWindow from './actions/openAboutWindow'
import showMainWindow from './actions/showMainWindow'
import openSupport from './actions/openSupport'
import openWebsite from './actions/openWebsite'
/* eslint-disable import/no-cycle */
import chooseDomain from './actions/chooseDomain'
import openSettings from './actions/openSettings'
/* eslint-enable import/no-cycle */

const messages = defineMessages({
  edit: {
    id: 'menuEdit',
    defaultMessage: 'Edit',
  },
  undo: {
    id: 'menuUndo',
    defaultMessage: 'Undo',
  },
  redo: {
    id: 'menuRedo',
    defaultMessage: 'Redo',
  },
  cut: {
    id: 'menuCut',
    defaultMessage: 'Cut',
  },
  copy: {
    id: 'menuCopy',
    defaultMessage: 'Copy',
  },
  paste: {
    id: 'menuPaste',
    defaultMessage: 'Paste',
  },
  selectAll: {
    id: 'menuSelectAll',
    defaultMessage: 'Select All',
  },
  speech: {
    id: 'menuSpeech',
    defaultMessage: 'Speech',
  },
  startSpeaking: {
    id: 'menuStartSpeaking',
    defaultMessage: 'Start Speaking',
  },
  stopSpeaking: {
    id: 'menuStopSpeaking',
    defaultMessage: 'Stop Speaking',
  },
  view: {
    id: 'menuView',
    defaultMessage: 'View',
  },
  reload: {
    id: 'menuReload',
    defaultMessage: 'Reload',
  },
  toggleFullScreen: {
    id: 'menuToggleFullScreen',
    defaultMessage: 'Toggle Full Screen',
  },
  resetZoom: {
    id: 'menuResetZoom',
    defaultMessage: 'Actual Size',
  },
  zoomIn: {
    id: 'menuZoomIn',
    defaultMessage: 'Zoom In',
  },
  zoomOut: {
    id: 'menuZoomOut',
    defaultMessage: 'Zoom Out',
  },
  window: {
    id: 'menuWindow',
    defaultMessage: 'Window',
  },
  close: {
    id: 'menuClose',
    defaultMessage: 'Close Window',
  },
  minimize: {
    id: 'menuMinimize',
    defaultMessage: 'Minimize',
  },
  zoom: {
    id: 'menuZoom',
    defaultMessage: 'Zoom',
  },
  front: {
    id: 'menuFront',
    defaultMessage: 'Bring All to Front',
  },
  help: {
    id: 'menuHelp',
    defaultMessage: 'Help',
  },
  about: {
    id: 'menuAbout',
    defaultMessage: 'About Grape',
  },
  learnMore: {
    id: 'menuLearnMore',
    defaultMessage: 'Learn More',
  },
  openHelpCenter: {
    id: 'menuOpenHelpCenter',
    defaultMessage: 'Open Help Center',
  },
  application: {
    id: 'menuApplication',
    defaultMessage: 'Application',
  },
  settings: {
    id: 'menuSettings',
    defaultMessage: 'Settings',
  },
  chooseDomain: {
    id: 'menuChooseDomain',
    defaultMessage: 'Choose domain',
  },
  quit: {
    id: 'menuQuit',
    defaultMessage: 'Quit',
  },
  services: {
    id: 'menuServices',
    defaultMessage: 'Services',
  },
  hide: {
    id: 'menuHide',
    defaultMessage: 'Hide Grape',
  },
  hideOthers: {
    id: 'menuHideOthers',
    defaultMessage: 'Hide Others',
  },
  unhide: {
    id: 'menuUnhide',
    defaultMessage: 'Show All',
  },
  open: {
    id: 'menuOpen',
    defaultMessage: 'Open',
  },
})

export const getMenuTemplate = () => {
  // eslint-disable-next-line global-require
  const { formatMessage } = require('../../i18n')
  const menu = [
    {
      label: formatMessage(messages.edit),
      submenu: [
        {
          label: formatMessage(messages.undo),
          role: 'undo',
        },
        {
          label: formatMessage(messages.redo),
          role: 'redo',
        },
        { type: 'separator' },
        {
          label: formatMessage(messages.cut),
          role: 'cut',
        },
        {
          label: formatMessage(messages.copy),
          role: 'copy',
        },
        {
          label: formatMessage(messages.paste),
          role: 'paste',
        },
        {
          label: formatMessage(messages.selectAll),
          role: 'selectall',
        },
        { type: 'separator' },
        {
          label: formatMessage(messages.speech),
          submenu: [
            {
              label: formatMessage(messages.startSpeaking),
              role: 'startspeaking',
            },
            {
              label: formatMessage(messages.stopSpeaking),
              role: 'stopspeaking',
            },
          ],
        },
      ],
    },
    {
      label: formatMessage(messages.view),
      submenu: [
        // Replacing "Force reload" with "Reload" to don't confuse a user with two reload button
        // https://jira.ubergrape.com/browse/GRAPE-17534
        {
          label: formatMessage(messages.reload),
          accelerator: 'CmdOrCtrl+R',
          role: 'forcereload',
        },
        { type: 'separator' },
        {
          label: formatMessage(messages.toggleFullScreen),
          role: 'togglefullscreen',
        },
        { type: 'separator' },
        {
          label: formatMessage(messages.resetZoom),
          role: 'resetzoom',
        },
        {
          label: formatMessage(messages.zoomIn),
          role: 'zoomin',
        },
        {
          label: formatMessage(messages.zoomOut),
          role: 'zoomout',
        },
      ],
    },
    {
      role: 'window',
      label: formatMessage(messages.window),
      submenu: [
        {
          label: formatMessage(messages.close),
          role: 'close',
        },
        {
          label: formatMessage(messages.minimize),
          role: 'minimize',
        },
        {
          label: formatMessage(messages.zoom),
          role: 'zoom',
        },
        { type: 'separator' },
        {
          label: formatMessage(messages.front),
          role: 'front',
        },
      ],
    },
    {
      role: 'help',
      label: formatMessage(messages.help),
      submenu: [
        {
          label: formatMessage(messages.about),
          click: openAboutWindow,
        },
        { type: 'separator' },
        {
          label: formatMessage(messages.learnMore),
          click: openWebsite,
        },
        {
          label: formatMessage(messages.openHelpCenter),
          click: openSupport,
        },
      ],
    },
  ]

  // Windows and Linux
  if (process.platform !== 'darwin') {
    menu.unshift({
      label: formatMessage(messages.application),
      submenu: [
        {
          label: formatMessage(messages.settings),
          click: openSettings,
          visible: state.isSettingsVisible,
        },
        {
          label: formatMessage(messages.chooseDomain),
          click: chooseDomain,
        },
        { type: 'separator' },
        {
          label: formatMessage(messages.quit),
          accelerator: 'Cmd+Q',
          click: quit,
        },
      ],
    })
  }

  // Mac
  if (process.platform === 'darwin') {
    menu.unshift({
      label: formatMessage(messages.application),
      submenu: [
        {
          label: formatMessage(messages.settings),
          click: openSettings,
          visible: state.isSettingsVisible,
        },
        {
          label: formatMessage(messages.chooseDomain),
          click: chooseDomain,
        },
        { type: 'separator' },
        {
          label: formatMessage(messages.services),
          role: 'services',
        },
        {
          label: formatMessage(messages.hide),
          role: 'hide',
        },
        {
          label: formatMessage(messages.hideOthers),
          role: 'hideothers',
        },
        {
          label: formatMessage(messages.unhide),
          role: 'unhide',
        },
        { type: 'separator' },
        {
          label: formatMessage(messages.quit),
          accelerator: 'Ctrl+Q',
          click: quit,
        },
      ],
    })
  }

  return menu
}

export const getTrayTemplate = () => {
  // eslint-disable-next-line global-require
  const { formatMessage } = require('../../i18n')
  return [
    { label: formatMessage(messages.open), click: showMainWindow },
    { label: formatMessage(messages.quit), click: quit },
  ]
}