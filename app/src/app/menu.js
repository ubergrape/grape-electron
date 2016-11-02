import {defineMessages} from 'react-intl'

import devMenu from '../electron/devMenu'
import showMainWindow from './showMainWindow'
import env from './env'
import state from './state'
import quit from './quit'
import {isOSX} from './utils'
import loadApp from './loadApp'
import {urls} from '../constants/pages'
import {formatMessage} from '../i18n'

function chooseDomain() {
  state.mainWindow.loadURL(urls.domain)
}

const messages = defineMessages({
  application: {
    id: 'menuApplication',
    defaultMessage: 'Application'
  },
  quit: {
    id: 'menuQuit',
    defaultMessage: 'Quit'
  },
  backToChat: {
    id: 'menuBackToChat',
    defaultMessage: 'Back to chat'
  },
  chooseDomain: {
    id: 'menuChooseDomain',
    defaultMessage: 'Choose domain'
  },
  edit: {
    id: 'menuEdit',
    defaultMessage: 'Edit'
  },
  undo: {
    id: 'menuUndo',
    defaultMessage: 'Undo'
  },
  redo: {
    id: 'menuRedo',
    defaultMessage: 'Redo'
  },
  cut: {
    id: 'menuCut',
    defaultMessage: 'Cut'
  },
  copy: {
    id: 'menuCopy',
    defaultMessage: 'Copy'
  },
  paste: {
    id: 'menuPaste',
    defaultMessage: 'Paste'
  },
  selectAll: {
    id: 'menuSelectAll',
    defaultMessage: 'Select All'
  },
  about: {
    id: 'menuAbout',
    defaultMessage: 'About Grape'
  },
  open: {
    id: 'menuOpen',
    defaultMessage: 'Open'
  }
})

export let main = [
  {
    label: formatMessage(messages.application),
    submenu: [
      {label: formatMessage(messages.quit), accelerator: 'Cmd+Q', click: quit},
      {label: formatMessage(messages.backToChat), click: loadApp},
      {label: formatMessage(messages.chooseDomain), click: chooseDomain}
    ]
  },
  {
    label: formatMessage(messages.edit),
    submenu: [
      {label: formatMessage(messages.undo), accelerator: 'CmdOrCtrl+Z', role: 'undo'},
      {label: formatMessage(messages.redo), accelerator: 'Shift+CmdOrCtrl+Z', role: 'redo'},
      {type: 'separator'},
      {label: formatMessage(messages.cut), accelerator: 'CmdOrCtrl+X', role: 'cut'},
      {label: formatMessage(messages.copy), accelerator: 'CmdOrCtrl+C', role: 'copy'},
      {label: formatMessage(messages.paste), accelerator: 'CmdOrCtrl+V', role: 'paste'},
      {label: formatMessage(messages.selectAll), accelerator: 'CmdOrCtrl+A', role: 'selectall'}
    ]
  }
]

if (isOSX()) {
  main[0].submenu.push(
    {type: 'separator'},
    {label: formatMessage(messages.about), role: 'about'}
  )
}

if (env.name !== 'production') {
  main = main.concat(devMenu)
}

export const tray = [
  {label: formatMessage(messages.open), click: showMainWindow},
  {label: formatMessage(messages.quit), click: quit}
]
