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

import ErrorBoundary from './error'
import About from './about'
import Domain from './domain'
import ConnectionError from './connection-error'

const pageComponentMap = {
  about: About,
  connectionError: ConnectionError,
  domain: Domain,
}

const styles = {
  '@global': {
    body: {
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
          '"proxima-nova", "Helvetica Neue", Arial, Helvetica, sans-serif',
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

const page = new URL(window.location.href).searchParams.get('page')
const Page = pageComponentMap[page]

render(
  <ErrorBoundary>
    <JssProvider jss={jss}>
      <Page />
    </JssProvider>
  </ErrorBoundary>,
  document.getElementById('grape'),
)
