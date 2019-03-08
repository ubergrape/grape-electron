// eslint-disable-next-line import/no-extraneous-dependencies
import { app } from 'electron'
import { defineMessages } from 'react-intl'

import devMenu from '../../electron/devMenu'
import env from '../env'
import quit from './actions/quit'
import backToChat from './actions/backToChat'
import openAboutWindow from './actions/openAboutWindow'
import showMainWindow from './actions/showMainWindow'
import chooseDomain from './actions/chooseDomain'
import openSupport from './actions/openSupport'
import openWebSite from './actions/openWebSite'

const { formatMessage } = require('../../i18n')

const messages = defineMessages({
  application: {
    id: 'menuApplication',
    defaultMessage: 'Application',
  },
  about: {
    id: 'menuAbout',
    defaultMessage: 'About Grape',
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
  quitGrape: {
    id: 'menuQuitGrape',
    defaultMessage: 'Quit Grape',
  },
  backToChat: {
    id: 'menuBackToChat',
    defaultMessage: 'Back to chat',
  },
  chooseDomain: {
    id: 'menuChooseDomain',
    defaultMessage: 'Choose domain',
  },
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
  view: {
    id: 'menuView',
    defaultMessage: 'View',
  },
  reload: {
    id: 'menuReload',
    defaultMessage: 'Reload',
  },
  forceReload: {
    id: 'menuForceReload',
    defaultMessage: 'Force Reload',
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
  toggleFullScreen: {
    id: 'menuToggleFullScreen',
    defaultMessage: 'Toggle Full Screen',
  },
  window: {
    id: 'menuWindow',
    defaultMessage: 'Window',
  },
  help: {
    id: 'menuHelp',
    defaultMessage: 'Help',
  },
  learnMore: {
    id: 'menuLearnMore',
    defaultMessage: 'Learn More',
  },
  support: {
    id: 'menuSupport',
    defaultMessage: 'Support',
  },
  open: {
    id: 'menuOpen',
    defaultMessage: 'Open',
  },
  quit: {
    id: 'menuQuit',
    defaultMessage: 'Quit',
  },
})

let menu = [
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
    ],
  },
  {
    label: formatMessage(messages.view),
    submenu: [
      {
        label: formatMessage(messages.reload),
        role: 'reload',
      },
      {
        label: formatMessage(messages.forceReload),
        role: 'forcereload',
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
      { type: 'separator' },
      {
        label: formatMessage(messages.toggleFullScreen),
        role: 'togglefullscreen',
      },
    ],
  },
  {
    role: 'window',
    label: formatMessage(messages.window),
    submenu: [
      {
        label: formatMessage(messages.minimize),
        role: 'minimize',
      },
      {
        label: formatMessage(messages.close),
        role: 'close',
      },
    ],
  },
  {
    role: 'help',
    label: formatMessage(messages.help),
    submenu: [
      {
        label: formatMessage(messages.learnMore),
        click: openWebSite,
      },
      {
        label: formatMessage(messages.support),
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
        label: formatMessage(messages.quit),
        accelerator: 'Cmd+Q',
        click: quit,
      },
      { label: formatMessage(messages.backToChat), click: backToChat },
      {
        label: formatMessage(messages.chooseDomain),
        click: chooseDomain,
        enabled: !env.chooseDomainDisabled,
      },
      { type: 'separator' },
      { label: formatMessage(messages.about), click: openAboutWindow },
    ],
  })
}

// Mac
if (process.platform === 'darwin') {
  menu.unshift({
    label: app.getName(),
    submenu: [
      {
        label: formatMessage(messages.about),
        click: openAboutWindow,
      },
      { type: 'separator' },
      { label: formatMessage(messages.backToChat), click: backToChat },
      {
        label: formatMessage(messages.chooseDomain),
        click: chooseDomain,
        enabled: !env.chooseDomainDisabled,
      },
      { type: 'separator' },
      {
        label: formatMessage(messages.services),
        role: 'services',
      },
      { type: 'separator' },
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
        label: formatMessage(messages.quitGrape),
        role: 'quit',
      },
    ],
  })

  menu[1].submenu.push(
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
  )

  menu[3].submenu = [
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
  ]
}

if (env.name !== 'production') {
  menu = menu.concat(devMenu)
}

export const main = menu

export const tray = [
  { label: formatMessage(messages.open), click: showMainWindow },
  { label: formatMessage(messages.quit), click: quit },
]
