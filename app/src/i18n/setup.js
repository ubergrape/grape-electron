import React, {Component} from 'react'
import {addLocaleData, IntlProvider} from 'react-intl'
import en from 'react-intl/locale-data/en'
import de from 'react-intl/locale-data/de'

import * as translations from '.'

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

