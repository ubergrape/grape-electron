// eslint-disable-next-line import/no-extraneous-dependencies
import { app } from 'electron'
import React from 'react'
import { renderToString } from 'react-dom/server'
import { IntlProvider, injectIntl } from 'react-intl'

import * as translations from './translations'

export const wrapWithIntlProvider = ChildComponent => props => {
  const locale = (app ? app.getLocale() : navigator.language).substr(0, 2)
  const messages = translations.uk
  return (
    <IntlProvider locale={locale} messages={messages}>
      {/* eslint-disable-next-line react/jsx-props-no-spreading */}
      <ChildComponent {...props} />
    </IntlProvider>
  )
}

// Extracts the `intl` object from react to be used outside.
const intl = (() => {
  let intlProps
  const Provider = wrapWithIntlProvider(
    injectIntl(props => {
      intlProps = props.intl
      return null
    }),
  )
  renderToString(<Provider />)
  return intlProps
})()

export const { formatMessage } = intl
