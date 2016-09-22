import React, {Component, PropTypes} from 'react'
import DocumentTitle from 'react-document-title'
import {
  FormattedMessage,
  defineMessages,
  injectIntl
} from 'react-intl'

import css from 'raw!./index.css'
import {urls} from '../../constants/pages'

const {ipcRenderer, remote} = window.require('electron')
const {domain} = remote.getGlobal('host')
const {domain: grapeDomain} = remote.getGlobal('grapeHost')

const messages = defineMessages({
  title: {
    id: 'lostConnectionTitle',
    defaultMessage: 'Grape: Lost Connection',
    description: 'Window title.'
  }
})

@injectIntl
export default class LostConnection extends Component {
  constructor(props) {
    super(props)
    this.state = {isLoading: false}
  }

  onReload = () => {
    this.setState({isLoading: true}, () => {
      ipcRenderer.send('loadChat')
    })
  }

  renderButton() {
    const {isLoading} = this.state
    let text

    if (isLoading) {
      text = (
        <FormattedMessage
          id="loading"
          description="Button text when it is loading."
          defaultMessage="Loading…" />
      )
    } else {
      text = (
        <FormattedMessage
          id="reloadGrape"
          description="Text for button which will reload the page."
          defaultMessage="reload Grape" />
      )
    }

    return (
      <button
        className={isLoading ? 'loading' : ''}
        onClick={this.onReload}
        disabled={isLoading}>
        {text}
      </button>
    )
  }

  render() {
    const {intl: {formatMessage}} = this.props

    return (
      <DocumentTitle title={formatMessage(messages.title)}>
        <div>
          <style dangerouslySetInnerHTML={{__html: css}} />
          <h1>
            <FormattedMessage
              id="couldNotConnect"
              defaultMessage="The app could not connect to the Grape server." />
          </h1>
          <h2>
            <FormattedMessage
              id="checkInternetConnection"
              defaultMessage="Please check if your internet connection is working properly." />
          </h2>
          <p>
            <FormattedMessage
              id="tryToReload"
              defaultMessage="Try to {button} again."
              values={{
                button: this.renderButton()
              }} />
          </p>
          {domain !== grapeDomain &&
            <p>
              <FormattedMessage
                id="tryTochangeDomain"
                defaultMessage="Or try to {button}."
                values={{
                  button: (
                    <a href={urls.domain}>
                      <FormattedMessage
                        id="changeDomain"
                        defaultMessage="change On Premise domain" />
                    </a>
                  )
                }} />
            </p>
          }
        </div>
      </DocumentTitle>
    )
  }
}

