import React from 'react'
import {render} from 'react-dom'

import {wrapWithIntlProvider} from '../i18n'
import Domain from './domain'
import Loading from './loading'
import LostConnection from './lost-connection'
import TokenAuth from './token-auth'

const pages = {
  '?page=lostConnection': LostConnection,
  '?page=loading': Loading,
  '?page=domain': Domain,
  '?page=tokenAuth': TokenAuth,
}

const Page = wrapWithIntlProvider(pages[location.search])

if (Page) {
  const container = document.body.appendChild(document.createElement('div'))
  container.style.height = '100%'
  render(<Page />, container)
}
