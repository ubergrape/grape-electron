import React, { Component, PropTypes } from 'react'
import DocumentTitle from 'react-document-title'
import { FormattedMessage, defineMessages, injectIntl } from 'react-intl'

import styles from './styles'
import { urls } from '../../constants/pages'

const { ipcRenderer, remote } = require('electron')

const { domain } = remote.getGlobal('host')
const { domain: grapeDomain } = remote.getGlobal('grapeHost')
const chooseDomainDisabled = remote.getGlobal('chooseDomainDisabled')

const messages = defineMessages({
  title: {
    id: 'lostConnectionTitle',
    defaultMessage: 'Grape: Lost Connection',
    description: 'Window title.',
  },
})

const errorMessages = defineMessages({
  checkConnection: {
    id: 'checkInternetConnection',
    defaultMessage:
      'Please check if your internet connection is working properly.',
    description: 'Connection error description.',
  },
})

@injectIntl
export default class ConnectionError extends Component {
  constructor(props) {
    super(props)
    this.state = { isLoading: false }
  }

  onReload = () => {
    this.setState({ isLoading: true }, () => {
      ipcRenderer.send('loadChat')
    })
  }

  renderButton() {
    const { isLoading } = this.state
    let text

    if (isLoading) {
      text = (
        <FormattedMessage
          id="loading"
          description="Button text when it is loading."
          defaultMessage="Loading…"
        />
      )
    } else {
      text = (
        <FormattedMessage
          id="reloadGrape"
          description="Text for button which will reload the page."
          defaultMessage="reload Grape"
        />
      )
    }

    return (
      <button onClick={this.onReload} disabled={isLoading}>
        {text}
      </button>
    )
  }

  renderReloadMessage() {
    if (this.state.isLoading) {
      return this.renderButton()
    }

    return (
      <FormattedMessage
        id="tryToReload"
        defaultMessage="Try to {button} again."
        values={{
          button: this.renderButton(),
        }}
      />
    )
  }

  render() {
    const {
      intl: { formatMessage },
      url,
    } = this.props

    return (
      <DocumentTitle title={formatMessage(messages.title)}>
        <div>
          <style dangerouslySetInnerHTML={{ __html: styles }} />
          <h1>
            <FormattedMessage
              id="couldNotConnect"
              defaultMessage="The app could not connect to the Grape server."
            />
          </h1>
          <h2>{formatMessage(errorMessages.checkConnection, { url })}</h2>
          <p>{this.renderReloadMessage()}</p>
          {domain !== grapeDomain &&
            !chooseDomainDisabled && (
              <p>
                <FormattedMessage
                  id="tryTochangeDomain"
                  defaultMessage="Or try to {button}."
                  values={{
                    button: (
                      <a href={urls.domain}>
                        <FormattedMessage
                          id="changeOnPremisesDomain"
                          defaultMessage="change the on-premises domain"
                      />
                      </a>
                    ),
                  }}
                />
              </p>
            )}
        </div>
      </DocumentTitle>
    )
  }
}
