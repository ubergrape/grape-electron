import React from 'react'
import { render } from 'react-dom'
import qs from 'querystring'

import Domain from './domain'
import Loading from './loading'
import ConnectionError from './connection-error'
import TokenAuth from './token-auth'
import About from './about'

const pageComponentMap = {
  connectionError: ConnectionError,
  loading: Loading,
  domain: Domain,
  tokenAuth: TokenAuth,
  about: About,
}

const { page, ...props } = qs.parse(window.location.search.substr(1))

if (pageComponentMap[page]) {
  // eslint-disable-next-line global-require
  const { wrapWithIntlProvider } = require('../i18n')
  const Page = wrapWithIntlProvider(pageComponentMap[page])
  const container = document.body.appendChild(document.createElement('div'))
  container.style.height = '100%'
  render(<Page {...props} />, container)
}
