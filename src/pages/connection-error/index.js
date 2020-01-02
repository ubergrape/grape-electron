import React, { Component } from 'react'
// eslint-disable-next-line import/no-extraneous-dependencies
import { ipcRenderer, remote } from 'electron'
import { Helmet } from 'react-helmet'
import { withStyles } from 'react-jss'
import { FormattedMessage, injectIntl } from 'react-intl'

import { images, pages } from '../../constants'
import pkg from '../../../package.json'
import styles from './styles'

const { host } = remote.getGlobal('store')
const { cloudDomain, onPremisesDomain } = host

const { icon } = images

const errorMessages = (type, url) => {
  switch (type) {
    case 'badSslCert': {
      return {
        id: 'badSslCert',
        defaultMessage: `The certificate used by instance ${url} seems to be invalid.`,
      }
    }
    default: {
      return {
        id: 'checkInternetConnection',
        defaultMessage: `The certificate used by instance ${url} seems to be invalid.`,
      }
    }
  }
}

class ConnectionError extends Component {
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
    const { classes } = this.props

    if (isLoading) {
      return (
        <span>
          <FormattedMessage id="loading" defaultMessage="Loading…" />
        </span>
      )
    }

    return (
      <button type="button" onClick={this.onReload} className={classes.button}>
        <FormattedMessage id="reloadGrape" defaultMessage="reload Grape" />
      </button>
    )
  }

  renderReloadMessage = () => {
    const { isLoading } = this.state
    if (isLoading) {
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
      classes,
      type,
      url,
      intl: { formatMessage },
    } = this.props

    return (
      <div className={classes.wrapper}>
        <Helmet>
          <title>
            {pkg.productName}:{' '}
            {formatMessage({
              id: 'lostConnectionTitle',
              defaultMessage: 'Lost connection',
            })}
          </title>
        </Helmet>
        <div className={classes.content}>
          <img className={classes.icon} alt={pkg.productName} src={icon} />
          <div className={classes.text}>
            <div>
              <FormattedMessage
                id="couldNotConnect"
                defaultMessage="The app could not connect to the Grape server."
              />
            </div>
            <div className={classes.error}>
              {formatMessage(errorMessages(type, url))}
            </div>
            <div>{this.renderReloadMessage()}</div>
            {cloudDomain !== onPremisesDomain && (
              <div>
                <FormattedMessage
                  id="tryToChangeDomain"
                  defaultMessage="Or try to {button}."
                  values={{
                    button: (
                      <a className={classes.link} href={pages.domain}>
                        <FormattedMessage
                          id="changeOnPremisesDomain"
                          defaultMessage="change the on-premises domain"
                        />
                      </a>
                    ),
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }
}

export default withStyles(styles)(injectIntl(ConnectionError))
