import React from 'react'
import DocumentTitle from 'react-document-title'
import {
  defineMessages,
  injectIntl
} from 'react-intl'

const css = `
  html, body {
    height: 100%
  }
  body {
    background: #fff url("../images/loading.gif") 50% 50% no-repeat;
  }
`

const messages = defineMessages({
  title: {
    id: 'loadingGrapeTitle',
    defaultMessage: 'Grape: Loading…',
    description: "Window title."
  }
})

export default injectIntl(({intl: {formatMessage}}) => (
  <DocumentTitle title={formatMessage(messages.title)}>
    <style dangerouslySetInnerHTML={{__html: css}} />
  </DocumentTitle>
))
