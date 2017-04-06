import React from 'react'
import {render} from 'react-dom'
import qs from 'querystring'

import {wrapWithIntlProvider} from '../i18n'
import Domain from './domain'
import Loading from './loading'
import ConnectionError from './connection-error'
import TokenAuth from './token-auth'

const pageComponentMap = {
  connectionError: ConnectionError,
  loading: Loading,
  domain: Domain,
  tokenAuth: TokenAuth
}

const {page, ...props} = qs.parse(location.search.substr(1))

if (pageComponentMap[page]) {
  const Page = wrapWithIntlProvider(pageComponentMap[page])
  const container = document.body.appendChild(document.createElement('div'))
  container.style.height = '100%'
  render(<Page {...props} />, container)
}
