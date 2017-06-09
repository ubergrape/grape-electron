import React from 'react'
import DocumentTitle from 'react-document-title'
import {
  defineMessages,
  injectIntl
} from 'react-intl'
import Spinner from 'grape-web/lib/components/spinner'

const messages = defineMessages({
  title: {
    id: 'loadingGrapeTitle',
    defaultMessage: 'Grape: Loading…',
    description: 'Window title.'
  }
})

export default injectIntl(({intl: {formatMessage}}) => (
  <DocumentTitle title={formatMessage(messages.title)}>
    <Spinner />
  </DocumentTitle>
))
