import React, { Component } from 'react'
import { ipcRenderer } from 'electron'
import DocumentTitle from 'react-document-title'
import { defineMessages, injectIntl } from 'react-intl'

const messages = defineMessages({
  title: {
    id: 'ssoLoginTitle',
    defaultMessage: 'Grape: SSO Login',
    description: 'Window title.',
  },
})

class TokenAuth extends Component {
  constructor(props) {
    super(props)

    this.state = {
      token: '',
      url: '',
    }

    ipcRenderer.on('submitAuthToken', this.onSubmitTokenAuth)
  }

  onSubmitTokenAuth = (e, { url, token }) => {
    this.setState({ url, token }, () => {
      this.form.submit()
    })
  }

  onRefForm = ref => {
    this.form = ref
  }

  render() {
    const { url, token } = this.state
    const {
      intl: { formatMessage },
    } = this.props

    return (
      <DocumentTitle title={formatMessage(messages.title)}>
        <form action={url} method="post" ref={this.onRefForm}>
          <input type="hidden" name="token" value={token} />
        </form>
      </DocumentTitle>
    )
  }
}

export default injectIntl(TokenAuth)
