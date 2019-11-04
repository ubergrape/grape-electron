import { defineMessages } from 'react-intl'
import state from '../state'

import quit from './actions/quit.js'
import openAboutWindow from './actions/openAboutWindow'
import showMainWindow from './actions/showMainWindow'
import openSupport from './actions/openSupport'
import openWebsite from './actions/openWebsite'
/* eslint-disable import/no-cycle */
import chooseDomain from './actions/chooseDomain'
import openSettings from './actions/openSettings'
/* eslint-enable import/no-cycle */

import { formatMessage } from '../i18n'

const messages = defineMessages({
  application: {
    id: 'menuApplication',
    defaultMessage: 'Application',
  },
  edit: {
    id: 'menuEdit',
    defaultMessage: 'Edit',
  },
})

export const getMenuTemplate = () => {
  const menu = [
    {
      label: formatMessage(messages.edit),
      submenu: [
        {
          label: 'Undo',
          role: 'undo',
        },
        {
          label: 'Redo',
          role: 'redo',
        },
        { type: 'separator' },
        {
          label: 'Cut',
          role: 'cut',
        },
        {
          label: 'Copy',
          role: 'copy',
        },
        {
          label: 'Paste',
          role: 'paste',
        },
        {
          label: 'Select All',
          role: 'selectall',
        },
        { type: 'separator' },
        {
          label: 'Speech',
          submenu: [
            {
              label: 'Start Speaking',
              role: 'startspeaking',
            },
            {
              label: 'Stop Speaking',
              role: 'stopspeaking',
            },
          ],
        },
      ],
    },
    {
      label: 'View',
      submenu: [
        // Replacing "Force reload" with "Reload" to don't confuse a user with two reload button
        // https://jira.ubergrape.com/browse/GRAPE-17534
        {
          label: 'Reload',
          role: 'forcereload',
        },
        { type: 'separator' },
        {
          label: 'Toggle Full Screen',
          role: 'togglefullscreen',
        },
        { type: 'separator' },
        {
          label: 'Actual Size',
          role: 'resetzoom',
        },
        {
          label: 'Zoom In',
          role: 'zoomin',
        },
        {
          label: 'Zoom Out',
          role: 'zoomout',
        },
      ],
    },
    {
      role: 'window',
      label: 'Window',
      submenu: [
        {
          label: 'Close Window',
          role: 'close',
        },
        {
          label: 'Minimize',
          role: 'minimize',
        },
        {
          label: 'Zoom',
          role: 'zoom',
        },
        { type: 'separator' },
        {
          label: 'Bring All to Front',
          role: 'front',
        },
      ],
    },
    {
      role: 'help',
      label: 'Help',
      submenu: [
        {
          label: 'About Grape',
          click: openAboutWindow,
        },
        { type: 'separator' },
        {
          label: 'Learn More',
          click: openWebsite,
        },
        {
          label: 'Open Help Center',
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
          label: 'Settings',
          click: openSettings,
          visible: state.isSettingsVisible,
        },
        {
          label: 'Choose domain',
          click: chooseDomain,
        },
        { type: 'separator' },
        {
          label: 'Quit',
          accelerator: 'Cmd+Q',
          click: quit,
        },
      ],
    })
  }

  // Mac
  if (process.platform === 'darwin') {
    menu.unshift({
      label: 'Application',
      submenu: [
        {
          label: 'Settings',
          click: openSettings,
          visible: state.isSettingsVisible,
        },
        {
          label: 'Choose domain',
          click: chooseDomain,
        },
        { type: 'separator' },
        {
          label: 'Services',
          role: 'services',
        },
        {
          label: 'Hide Grape',
          role: 'hide',
        },
        {
          label: 'Hide Others',
          role: 'hideothers',
        },
        {
          label: 'Show All',
          role: 'unhide',
        },
        { type: 'separator' },
        {
          label: 'Quit',
          accelerator: 'Cmd+Q',
          click: quit,
        },
      ],
    })
  }

  return menu
}

export const trayTemplate = [
  { label: 'Open', click: showMainWindow },
  { label: 'Quit', click: quit },
]
