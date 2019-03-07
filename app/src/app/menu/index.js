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
import { formatMessage } from '../../i18n'

const messages = defineMessages({
  application: {
    id: 'menuApplication',
    defaultMessage: 'Application',
  },
  about: {
    id: 'menuAbout',
    defaultMessage: 'About Grape',
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
  speech: {
    id: 'menuSpeech',
    defaultMessage: 'Speech',
  },
  view: {
    id: 'menuView',
    defaultMessage: 'View',
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
    label: formatMessage(messages.application),
    submenu: [
      { label: formatMessage(messages.backToChat), click: backToChat },
      {
        label: formatMessage(messages.chooseDomain),
        click: chooseDomain,
        enabled: !env.chooseDomainDisabled,
      },
    ],
  },
  {
    label: formatMessage(messages.edit),
    submenu: [
      { role: 'undo' },
      { role: 'redo' },
      { type: 'separator' },
      { role: 'cut' },
      { role: 'copy' },
      { role: 'paste' },
      { role: 'selectall' },
    ],
  },
  {
    label: formatMessage(messages.view),
    submenu: [
      { role: 'reload' },
      { role: 'forcereload' },
      { type: 'separator' },
      { role: 'resetzoom' },
      { role: 'zoomin' },
      { role: 'zoomout' },
      { type: 'separator' },
      { role: 'togglefullscreen' },
    ],
  },
  {
    role: 'window',
    submenu: [{ role: 'minimize' }, { role: 'close' }],
  },
  {
    role: 'help',
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

if (process.platform === 'darwin') {
  menu.unshift({
    label: app.getName(),
    submenu: [
      {
        label: formatMessage(messages.about),
        click: openAboutWindow,
      },
      { type: 'separator' },
      { role: 'services' },
      { type: 'separator' },
      { role: 'hide' },
      { role: 'hideothers' },
      { role: 'unhide' },
      { type: 'separator' },
      { role: 'quit' },
    ],
  })

  menu[2].submenu.push(
    { type: 'separator' },
    {
      label: formatMessage(messages.speech),
      submenu: [{ role: 'startspeaking' }, { role: 'stopspeaking' }],
    },
  )

  menu[4].submenu = [
    { role: 'close' },
    { role: 'minimize' },
    { role: 'zoom' },
    { type: 'separator' },
    { role: 'front' },
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
