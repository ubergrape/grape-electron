import React, {Component} from 'react'
import {renderToString} from 'react-dom/server'
import {addLocaleData, IntlProvider, injectIntl, defineMessages} from 'react-intl'
import en from 'react-intl/locale-data/en'
import de from 'react-intl/locale-data/de'

import * as translations from './translations'

addLocaleData([...en, ...de])

// FIXME
const locale = 'en'

const messages = translations[locale]

export function wrapWithIntlProvider(WrappedComponent) {
  return class extends Component {
    render() {
      return (
        <IntlProvider locale={locale} messages={messages}>
          <WrappedComponent />
        </IntlProvider>
      )
    }
  }
}

// Extracts the `intl` object from react to be used outside.
const intl = (() => {
  let intl
  const Provider = wrapWithIntlProvider(injectIntl(props => {
    intl = props.intl
    return null
  }))
  renderToString(<Provider />)
  return intl
})()

export const {
  formatDate,
  formatTime,
  formatRelative,
  formatNumber,
  formatPlural,
  formatMessage,
  formatHTMLMessage
} = intl

export {defineMessages}
