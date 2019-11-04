import React from 'react'
import { render } from 'react-dom'
import { JssProvider } from 'react-jss'
import isolate from 'jss-plugin-isolate'
import global from 'jss-plugin-global'
import extend from 'jss-plugin-extend'
import nested from 'jss-plugin-nested'
import expand from 'jss-plugin-expand'
import camel from 'jss-plugin-camel-case'
import unit from 'jss-plugin-default-unit'
import functions from 'jss-plugin-rule-value-function'
import { create } from 'jss'
import qs from 'querystring'

import ErrorBoundary from './error'
import About from './about'
import Domain from './domain'
import ConnectionError from './connection-error'

import { wrapWithIntlProvider } from '../i18n'

const pageComponentMap = {
  about: About,
  connectionError: ConnectionError,
  domain: Domain,
}

const styles = {
  '@global': {
    html: {
      height: '100%',
    },
    body: {
      height: '100%',
      margin: 0,
    },
  },
}

const jss = create()
jss.use(
  functions(),
  isolate({
    reset: [
      'inherit',
      {
        fontFamily:
          '"Proxima Nova", "Helvetica Neue", Arial, Helvetica, sans-serif',
      },
    ],
  }),
  global(),
  extend(),
  nested(),
  camel(),
  unit(),
  expand(),
)

jss.createStyleSheet(styles).attach()
const { page, type, url } = qs.parse(window.location.search.substr(1))
const Page = wrapWithIntlProvider(pageComponentMap[page])

render(
  <ErrorBoundary>
    <JssProvider jss={jss}>
      <Page page={page} type={type} url={url} />
    </JssProvider>
  </ErrorBoundary>,
  document.getElementById('grape'),
)
