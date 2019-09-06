// eslint-disable-next-line import/no-extraneous-dependencies
import { app, BrowserWindow } from 'electron'

import isDevelopment from '../utils/isDevelopment'
import quit from './actions/quit.js'
import backToChat from './actions/backToChat'
import openAboutWindow from './actions/openAboutWindow'
import showMainWindow from './actions/showMainWindow'
import chooseDomain from './actions/chooseDomain'
import openSupport from './actions/openSupport'
import openWebsite from './actions/openWebsite'

export const menu = [
  {
    label: 'Edit',
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
      {
        label: 'Reload',
        role: 'reload',
      },
      {
        label: 'Force Reload',
        role: 'forcereload',
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
      { type: 'separator' },
      {
        label: 'Toggle Full Screen',
        role: 'togglefullscreen',
      },
    ],
  },
  {
    role: 'window',
    label: 'Window',
    submenu: [
      {
        label: 'Minimize',
        role: 'minimize',
      },
      {
        label: 'Close Window',
        role: 'close',
      },
    ],
  },
  {
    role: 'help',
    label: 'Help',
    submenu: [
      {
        label: 'Learn More',
        click: openWebsite,
      },
      {
        label: 'Support',
        click: openSupport,
      },
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
]

// Windows and Linux
if (process.platform !== 'darwin') {
  menu.unshift({
    label: 'Application',
    submenu: [
      {
        label: 'Quit',
        accelerator: 'Cmd+Q',
        click: quit,
      },
      { label: 'Back to chat', click: backToChat },
      {
        label: 'Choose domain',
        click: chooseDomain,
        // enabled: !env.chooseDomainDisabled,
      },
      { type: 'separator' },
      { label: 'About Grape', click: openAboutWindow },
    ],
  })
}

// Mac
if (process.platform === 'darwin') {
  menu.unshift({
    label: app.getName(),
    submenu: [
      {
        label: 'About Grape',
        click: openAboutWindow,
      },
      { type: 'separator' },
      { label: 'Back to chat', click: backToChat },
      {
        label: 'Choose domain',
        click: chooseDomain,
        // enabled: !env.chooseDomainDisabled,
      },
      { type: 'separator' },
      {
        label: 'Services',
        role: 'services',
      },
      { type: 'separator' },
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
        label: 'Quit Grape',
        role: 'quit',
      },
    ],
  })
}

if (isDevelopment) {
  menu.push({
    label: 'Development',
    submenu: [
      {
        label: 'Reload',
        accelerator: 'CmdOrCtrl+R',
        click: () => {
          BrowserWindow.getFocusedWindow().webContents.reloadIgnoringCache()
        },
      },
      {
        label: 'Toggle DevTools',
        accelerator: 'Alt+CmdOrCtrl+I',
        click: () => {
          BrowserWindow.getFocusedWindow().toggleDevTools()
        },
      },
    ],
  })
}

export const tray = [
  { label: 'Open', click: showMainWindow },
  { label: 'Quit', click: quit },
]
